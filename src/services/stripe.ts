import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

export async function redirectToCheckout(_priceId: string) {
  // In production, this would create a Checkout Session on the server
  // and redirect using stripe.redirectToCheckout({ sessionId })
  // For now, redirect to a placeholder
  window.location.href = '/pricing?checkout=pending'
}
