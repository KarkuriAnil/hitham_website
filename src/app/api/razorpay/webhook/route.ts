import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Razorpay webhook endpoint. Configure this URL in Razorpay Dashboard →
 * Settings → Webhooks as: https://yourdomain.com/api/razorpay/webhook
 *
 * Why this exists alongside /verify-payment: the verify route confirms the
 * checkout response wasn't tampered with, but it only runs if the
 * customer's browser stays open and completes the redirect/handler. If the
 * tab closes or the network drops right after a successful charge, the
 * webhook is Razorpay calling YOUR server directly to say "this payment
 * settled" — independent of what the browser does. This route currently
 * just verifies and logs; wire it to update Firestore order/payment status
 * once you decide on the admin-write security model (see README).
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set — rejecting webhook.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  console.log("Razorpay webhook received:", event.event);

  // TODO: once an admin-write strategy is chosen (see README → "Read this
  // before deploying"), use this event to mark the matching order/payment
  // as confirmed in Firestore via the Admin SDK, keyed by
  // event.payload.payment.entity.order_id.

  return NextResponse.json({ received: true });
}
