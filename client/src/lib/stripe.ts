import { loadStripe } from "@stripe/stripe-js";

// Use test key for development
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51QbLkGP4ZKWvNhK8nNQzY8j9w6xF8w0x5y7w9t8w4x9k5q3z2n1m8c7b6v5x4z9';

if (!stripePublicKey) {
  console.error('Missing Stripe public key. Using test key for development.');
}

console.log('Stripe public key configured:', stripePublicKey ? 'Yes' : 'No');

export const stripePromise = loadStripe(stripePublicKey);
