import Stripe from 'stripe';

const secretKey = (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...'))
  ? process.env.STRIPE_SECRET_KEY 
  : 'sk_test_51TAqk4D882WcsUbmbsySyL6DrZMMa6PPMsFdk2DJ9xa7iakf5XKBp9baIF69AsOxZE1ZWpfok6cZQxPbQQOYW6y500qA4E6NRT';

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-01-27.acacia' as any,
  appInfo: {
    name: 'Guides Digitaux',
    version: '1.0.0',
  },
});
