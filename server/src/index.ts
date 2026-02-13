import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { stripeRouter, stripeWebhookHandler } from './stripe.js';
import { emailRouter } from './email.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Stripe webhooks need raw body — mount BEFORE json parser
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

// Standard middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/stripe', stripeRouter);
app.use('/api/email', emailRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`HottWatt API server running on port ${PORT}`);
});
