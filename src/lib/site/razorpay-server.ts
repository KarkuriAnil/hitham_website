import Razorpay from "razorpay";

// Server-only. RAZORPAY_KEY_SECRET must never be prefixed with NEXT_PUBLIC_
// or referenced from any "use client" file — that would ship it to the
// browser bundle. This file is only ever imported from API routes.
let razorpayClient: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set. Add them to .env.local."
    );
  }

  razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
}
