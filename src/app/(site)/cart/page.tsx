"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/site/cart/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-ink-soft/40" />
        <p className="mt-4 font-display text-xl text-ink">Your cart is empty</p>
        <p className="mt-1 text-sm text-ink-soft">Add something good for you.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <h1 className="growth-line mb-8 inline font-display text-3xl font-medium text-ink">
        Your cart
      </h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-xl border border-border-soft p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ivory-dim">
              {item.image && (
                <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">{item.title}</p>
              <p className="text-sm text-ink-soft">₹{item.price.toLocaleString("en-IN")}</p>
            </div>
            <div className="flex items-center rounded-full border border-border-soft">
              <button
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center text-ink-soft"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-7 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center text-ink-soft"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="w-20 text-right font-medium text-ink">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-ink-soft hover:text-clay"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl bg-ivory-dim p-5">
        <div>
          <p className="text-sm text-ink-soft">Subtotal</p>
          <p className="font-display text-2xl font-medium text-ink">
            ₹{subtotal.toLocaleString("en-IN")}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
      </div>
    </div>
  );
}
