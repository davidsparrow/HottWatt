import { Router } from 'express';
import type { Request, Response } from 'express';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'HottWatt <noreply@hottwatt.com>';

export const emailRouter = Router();

// ─── Booking confirmation email ───
emailRouter.post('/booking-confirmation', async (req: Request, res: Response) => {
  try {
    const { to, driverName, hostName, chargerBrand, chargerModel, address, city, date, startTime, endTime, totalCost } = req.body;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Booking Confirmed — ${chargerBrand} ${chargerModel} in ${city}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e5e7eb; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 24px; font-weight: bold; color: #fff;">Hott<span style="color: #22c55e;">Watt</span></span>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
            <h2 style="color: #22c55e; margin: 0 0 16px;">Booking Confirmed!</h2>
            <p>Hi ${driverName},</p>
            <p>Your charging session with <strong>${hostName}</strong> is confirmed.</p>
            <table style="width: 100%; margin: 16px 0; font-size: 14px;">
              <tr><td style="color: #9ca3af; padding: 4px 0;">Charger</td><td style="text-align: right;">${chargerBrand} ${chargerModel}</td></tr>
              <tr><td style="color: #9ca3af; padding: 4px 0;">Location</td><td style="text-align: right;">${address}, ${city}</td></tr>
              <tr><td style="color: #9ca3af; padding: 4px 0;">Date</td><td style="text-align: right;">${date}</td></tr>
              <tr><td style="color: #9ca3af; padding: 4px 0;">Time</td><td style="text-align: right;">${startTime} — ${endTime}</td></tr>
              <tr><td style="color: #9ca3af; padding: 4px 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">Total</td><td style="text-align: right; color: #22c55e; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">$${totalCost}</td></tr>
            </table>
            <p style="font-size: 12px; color: #6b7280;">The exact address is now unlocked in your booking. Open the app to activate the charger when you arrive.</p>
          </div>
          <p style="text-align: center; font-size: 11px; color: #4b5563; margin-top: 24px;">HottWatt — Peer-to-peer EV charging</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }

    res.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ─── Welcome email ───
emailRouter.post('/welcome', async (req: Request, res: Response) => {
  try {
    const { to, name } = req.body;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to HottWatt!',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e5e7eb; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 24px; font-weight: bold; color: #fff;">Hott<span style="color: #22c55e;">Watt</span></span>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
            <h2 style="color: #22c55e; margin: 0 0 16px;">Welcome, ${name || 'there'}!</h2>
            <p>You're all set with your free HottWatt account. Here's what you can do:</p>
            <ul style="padding-left: 20px; font-size: 14px; line-height: 1.8;">
              <li><strong>Browse</strong> nearby home EV chargers</li>
              <li><strong>Book</strong> and pay through the app</li>
              <li><strong>List</strong> your own charger and start earning</li>
              <li><strong>Join</strong> a Charge Club in your neighborhood</li>
            </ul>
            <p style="font-size: 13px; color: #9ca3af;">Upgrade to Pro for priority booking, no ads, WattClub discounts, and Last-Mile ride service.</p>
          </div>
          <p style="text-align: center; font-size: 11px; color: #4b5563; margin-top: 24px;">HottWatt — Peer-to-peer EV charging</p>
        </div>
      `,
    });

    if (error) {
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ─── Club membership request email ───
emailRouter.post('/club-request', async (req: Request, res: Response) => {
  try {
    const { to, clubName, requesterName } = req.body;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New membership request for ${clubName}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e5e7eb; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 24px; font-weight: bold; color: #fff;">Hott<span style="color: #22c55e;">Watt</span></span>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
            <h2 style="color: #C42348; margin: 0 0 16px;">New Member Request</h2>
            <p><strong>${requesterName}</strong> wants to join <strong>${clubName}</strong>.</p>
            <p>Log in to HottWatt to approve or decline this request.</p>
          </div>
          <p style="text-align: center; font-size: 11px; color: #4b5563; margin-top: 24px;">HottWatt — Peer-to-peer EV charging</p>
        </div>
      `,
    });

    if (error) {
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
