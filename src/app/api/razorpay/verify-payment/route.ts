import { NextResponse } from "next/server";
import crypto from "crypto";

interface VerifyBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: VerifyBody =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Razorpay is not configured on the server." },
        { status: 500 }
      );
    }

    // Per Razorpay docs: HMAC-SHA256 of "order_id|payment_id" using the key
    // secret must match the signature returned by Checkout. This is the
    // only way to confirm the payment wasn't tampered with client-side.
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Signature verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Razorpay verify-payment failed:", err);
    return NextResponse.json(
      { success: false, error: "Couldn't verify the payment." },
      { status: 500 }
    );
  }
}
