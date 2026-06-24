import { NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/site/razorpay-server";

interface CreateOrderBody {
  amount: number; // in rupees, converted to paise below
  notes?: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    const body: CreateOrderBody = await request.json();

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(body.amount * 100), // paise
      currency: "INR",
      receipt: `hitham_${Date.now()}`,
      notes: body.notes,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay create-order failed:", err);
    return NextResponse.json({ error: "Couldn't create the payment order." }, { status: 500 });
  }
}
