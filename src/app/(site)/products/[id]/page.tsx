"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/site/cart/cart-context";
import { getStorefrontProduct } from "@/lib/site/products";
import type { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getStorefrontProduct(params.id).then(setProduct);
  }, [params.id]);

  if (product === undefined) {
    return <div className="mx-auto max-w-6xl px-5 py-16 text-sm text-ink-soft">Loading…</div>;
  }

  if (product === null) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center text-sm text-ink-soft">
        We couldn&apos;t find that product.
      </div>
    );
  }

  function handleAddToCart() {
    if (!product) return;
    addItem(
      { productId: product.id, title: product.title, price: product.price, image: product.images[0] || "" },
      quantity
    );
    toast.success(`${quantity} × ${product.title} added to cart`);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-ivory-dim">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={product.title}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-soft/40">
                <span className="font-display text-lg">HITHAM</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? "border-sage" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Badge variant="outline">{product.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-medium text-ink">{product.title}</h1>
          {product.rating > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border-soft"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-ink-soft">{product.rating.toFixed(1)}</span>
            </div>
          )}

          <p className="mt-4 text-2xl font-medium text-ink">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">{product.description}</p>

          {product.benefits.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.benefits.map((b) => (
                <Badge key={b} variant="success">
                  {b}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border-soft">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-ink-soft"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-ink-soft"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              size="lg"
              className="flex-1"
            >
              <ShoppingBag className="h-4 w-4" />
              {product.stockQuantity === 0 ? "Out of stock" : "Add to cart"}
            </Button>
          </div>

          {product.ingredients.length > 0 && (
            <div className="mt-10 border-t border-border-soft pt-6">
              <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">Ingredients</p>
              <p className="text-sm text-ink-soft">{product.ingredients.join(", ")}</p>
            </div>
          )}

          {product.nutritionInfo && Object.keys(product.nutritionInfo).length > 0 && (
            <div className="mt-6 grid grid-cols-5 gap-2 rounded-lg bg-ivory-dim p-4 text-center">
              {(["calories", "protein", "carbs", "fat", "fiber"] as const).map((key) => (
                <div key={key}>
                  <p className="text-sm font-medium text-ink">
                    {product.nutritionInfo[key] ?? "—"}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-ink-soft">{key}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
