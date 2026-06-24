"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/site/cart/cart-context";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || "",
    });
    toast.success(`${product.title} added to cart`);
  }

  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-ivory-dim">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/40">
            <span className="font-display text-sm">HITHAM</span>
          </div>
        )}
        {product.stockQuantity === 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] text-ivory">
            Out of stock
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={product.stockQuantity === 0}
          aria-label={`Add ${product.title} to cart`}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-ink-soft">{product.category}</p>
        <p className="mt-0.5 font-display text-base font-medium text-ink">{product.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-ink-soft">₹{product.price.toLocaleString("en-IN")}</p>
          {product.rating > 0 && (
            <span className="flex items-center gap-1 text-xs text-ink-soft">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
