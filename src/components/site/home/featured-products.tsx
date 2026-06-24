import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/products/product-card";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft">Start here</p>
          <h2 className="growth-line mt-1 inline font-display text-2xl font-medium text-ink lg:text-3xl">
            This week&apos;s picks
          </h2>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-1 text-sm text-ink-soft hover:text-ink lg:flex"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
