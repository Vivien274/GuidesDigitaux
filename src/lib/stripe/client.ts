import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

if (!secretKey || !secretKey.startsWith('sk_')) {
  throw new Error('STRIPE_SECRET_KEY est absente ou invalide.');
}

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-01-27.acacia' as any,
  appInfo: {
    name: 'Guides Digitaux',
    version: '1.0.0',
  },
});
