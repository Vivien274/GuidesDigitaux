import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || !secretKey.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY est absente ou invalide.');
  }
  stripeInstance = new Stripe(secretKey, {
    apiVersion: '2025-01-27.acacia' as any,
    appInfo: {
      name: 'Guides Digitaux',
      version: '1.0.0',
    },
  });
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

