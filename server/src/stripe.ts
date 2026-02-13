import { Router } from 'express';
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from './supabase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export const stripeRouter = Router();

// ─── Create checkout session ───
stripeRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { userId, planSlug, email } = req.body;

    // Look up the plan
    const { data: plan } = await supabaseAdmin
      .from('plans')
      .select('*')
      .eq('slug', planSlug)
      .single();

    if (!plan || !plan.stripe_price_id) {
      res.status(400).json({ error: 'Invalid plan' });
      return;
    }

    // Get or create Stripe customer
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/browse?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}/browse`,
      metadata: {
        supabase_user_id: userId,
        plan_id: plan.id,
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// ─── Create billing portal session ───
stripeRouter.post('/create-portal-session', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!profile?.stripe_customer_id) {
      res.status(400).json({ error: 'No billing account found' });
      return;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/browse`,
    });

    res.json({ sessionUrl: session.url });
  } catch (err) {
    console.error('Portal error:', err);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// ─── Webhook handler ───
export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    res.status(400).send('Webhook error');
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const planId = session.metadata?.plan_id;

        if (userId && planId && session.subscription) {
          // Deactivate existing subscription
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', userId)
            .eq('status', 'active');

          // Create new subscription
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);

          await supabaseAdmin.from('subscriptions').insert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
            stripe_subscription_id: sub.id,
            stripe_customer_id: session.customer as string,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'cancelled',
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        // Cancel the subscription
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', sub.id);

        // Re-assign free plan
        const { data: existing } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', sub.id)
          .single();

        if (existing) {
          const { data: freePlan } = await supabaseAdmin
            .from('plans')
            .select('id')
            .eq('slug', 'free')
            .single();

          if (freePlan) {
            await supabaseAdmin.from('subscriptions').insert({
              user_id: existing.user_id,
              plan_id: freePlan.id,
              status: 'active',
            });
          }
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
