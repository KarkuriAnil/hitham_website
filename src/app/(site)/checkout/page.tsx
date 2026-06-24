"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/components/site/cart/cart-context";
import { useAuth } from "@/components/site/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { openRazorpayCheckout } from "@/lib/site/razorpay-client";
import { createOrderRecord } from "@/lib/site/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { user, profile } = useAuth();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="font-display text-xl text-ink">Your cart is empty</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="font-display text-xl text-ink">Sign in to check out</p>
        <p className="mt-2 text-sm text-ink-soft">
          We use your account to track this order and any subscriptions.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  async function handlePlaceOrder(e: FormEvent) {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Add a shipping address before continuing.");
      return;
    }

    setPlacing(true);

    await openRazorpayCheckout({
      amount: subtotal,
      name: profile?.fullName || user!.displayName || "",
      email: user!.email || "",
      contact: phone,
      description: `HITHAM order — ${items.length} item${items.length > 1 ? "s" : ""}`,
      onSuccess: async (response) => {
        try {
          await createOrderRecord({
            userId: user!.uid,
            userEmail: user!.email || "",
            userName: profile?.fullName || user!.displayName || "",
            items,
            totalAmount: subtotal,
            shippingAddress: address,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
          });
          clear();
          toast.success("Payment successful — your order is in!");
          router.push("/checkout/success");
        } catch (err) {
          console.error(err);
          toast.error(
            "Payment succeeded, but we couldn't save your order. Contact support with your payment ID."
          );
        } finally {
          setPlacing(false);
        }
      },
      onFailure: (error) => {
        toast.error(error);
        setPlacing(false);
      },
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <h1 className="growth-line mb-8 inline font-display text-3xl font-medium text-ink">
        Checkout
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handlePlaceOrder} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="For delivery updates"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Shipping address</Label>
            <Textarea
              id="address"
              required
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat / House no., street, city, state, PIN code"
            />
          </div>

          <Button type="submit" size="lg" disabled={placing}>
            {placing ? "Processing…" : `Pay ₹${subtotal.toLocaleString("en-IN")}`}
          </Button>
          <p className="text-center text-xs text-ink-soft">
            Payments are processed securely by Razorpay. HITHAM never sees your card details.
          </p>
        </form>

        <div className="rounded-xl bg-ivory-dim p-5">
          <p className="mb-4 font-display text-lg text-ink">Order summary</p>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-ink-soft">
                  {item.title} × {item.quantity}
                </span>
                <span className="text-ink">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border-soft pt-4 font-medium text-ink">
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
