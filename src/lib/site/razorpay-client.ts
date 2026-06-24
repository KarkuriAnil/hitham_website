"use client";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface OpenCheckoutOptions {
  amount: number; // rupees
  name: string;
  email: string;
  contact?: string;
  description: string;
  notes?: Record<string, string>;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onFailure: (error: string) => void;
}

let scriptLoadPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script."));
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export async function openRazorpayCheckout(options: OpenCheckoutOptions): Promise<void> {
  try {
    await loadRazorpayScript();

    const orderRes = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: options.amount, notes: options.notes }),
    });

    if (!orderRes.ok) {
      const data = await orderRes.json().catch(() => ({}));
      options.onFailure(data.error || "Couldn't start the payment. Try again.");
      return;
    }

    const order = await orderRes.json();

    const RazorpayConstructor = (
      window as unknown as { Razorpay: new (opts: Record<string, unknown>) => RazorpayInstance }
    ).Razorpay;

    const razorpay = new RazorpayConstructor({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "HITHAM — House Of Organic Foods",
      description: options.description,
      order_id: order.orderId,
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.contact,
      },
      theme: { color: "#1f2b22" },
      handler: async (response: RazorpaySuccessResponse) => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            options.onSuccess(response);
          } else {
            options.onFailure(verifyData.error || "Payment verification failed.");
          }
        } catch {
          options.onFailure("Couldn't verify the payment. Contact support if you were charged.");
        }
      },
    });

    razorpay.on("payment.failed", (response: { error?: { description?: string } }) => {
      options.onFailure(response.error?.description || "Payment failed. Please try again.");
    });

    razorpay.open();
  } catch (err) {
    console.error(err);
    options.onFailure("Couldn't open the payment window. Check your connection and try again.");
  }
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error?: { description?: string } }) => void) => void;
}
