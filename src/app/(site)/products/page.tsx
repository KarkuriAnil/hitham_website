"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/site/products/product-card";
import { Input } from "@/components/ui/input";
import { getStorefrontProducts } from "@/lib/site/products";
import type { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;
    getStorefrontProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    if (!products) return ["All"];
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = !q || p.title.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-ink-soft">Shop</p>
        <h1 className="growth-line mt-1 inline font-display text-3xl font-medium text-ink">
          Everything HITHAM
        </h1>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                category === c
                  ? "bg-moss text-ivory"
                  : "bg-ivory-dim text-ink-soft hover:bg-sage-dim"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {products === null ? (
        <p className="text-sm text-ink-soft">Loading products…</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-soft">
          No products match your search just yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
