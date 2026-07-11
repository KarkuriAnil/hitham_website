"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Share2 } from "lucide-react";
import { ProductCard } from "@/components/site/products/product-card";
import { WhyUsScroll } from "@/components/site/home/why-us-scroll";
import { IngredientsMatter } from "@/components/site/home/ingredients-matter";
import { getStorefrontProducts } from "@/lib/site/products";
import type { Product } from "@/types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    getStorefrontProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        const cats = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        );
        setCategories(cats);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  const latest = products.slice(0, 4);
  const bestSellers = products.slice(0, 3);

  const CATEGORY_EMOJI: Record<string, string> = {
    "Detox Drinks": "🍵",
    "Millet Products": "🌾",
    "Breakfast Kits": "🍳",
    Superfoods: "🥗",
    Beverages: "🥤",
    Snacks: "🫘",
  };

  return (
    <div className="bg-parchment">

      {/* Announcement bar */}
      <div className="bg-hitham-gold py-2 text-center text-xs font-bold text-veda-green">
        🌿 FREE shipping on all orders above ₹999 &nbsp;·&nbsp; No junk. No
        chemicals. No compromises.
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-veda-green">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-16 lg:px-8 lg:py-24">

          {/* Left text */}
          <div className="flex-1 lg:pr-8">
            <p className="font-display text-lg font-medium italic text-parchment/70 lg:text-xl">
              Changing The Way India Eats
            </p>
            <div className="mt-2 h-px w-48 bg-parchment/30" />
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-tight text-hitham-gold lg:text-6xl xl:text-7xl">
              VEDAHITHAM
            </h1>
            <div className="mt-3 h-px w-48 bg-parchment/30" />
            <p className="mt-4 font-display text-lg font-semibold text-parchment lg:text-xl">
              More than a food — It&apos;s a Lifestyle
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-full bg-hitham-gold px-7 py-3.5 text-sm font-bold text-veda-green transition-colors hover:bg-hitham-gold-light"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop now
              </Link>
              <Link
                href="/recommendations"
                className="flex items-center gap-2 rounded-full border border-parchment/40 px-7 py-3.5 text-sm font-medium text-parchment transition-colors hover:bg-parchment/10"
              >
                Find your fit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right circular food image */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <div className="relative h-[400px] w-[400px]">
              <div className="absolute inset-0 rounded-full border-[12px] border-hitham-gold opacity-50" />
              <div className="absolute inset-5 rounded-full border-[6px] border-hitham-gold opacity-30" />
              <div className="absolute inset-8 overflow-hidden rounded-full">
                <Image
                  src="/hero-food.jpg"
                  alt="Fresh Ayurvedic ingredients"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Gold leaf decoration top-right */}
              <div className="absolute -right-3 top-10">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <ellipse
                    cx="22"
                    cy="11"
                    rx="7"
                    ry="14"
                    fill="#C59C44"
                    opacity="0.9"
                    transform="rotate(-30 22 11)"
                  />
                  <ellipse
                    cx="30"
                    cy="25"
                    rx="7"
                    ry="14"
                    fill="#C59C44"
                    opacity="0.6"
                    transform="rotate(20 30 25)"
                  />
                </svg>
              </div>
              {/* White leaf decoration bottom-left */}
              <div className="absolute -left-3 bottom-14">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <ellipse
                    cx="18"
                    cy="9"
                    rx="5"
                    ry="11"
                    fill="white"
                    opacity="0.7"
                    transform="rotate(20 18 9)"
                  />
                  <ellipse
                    cx="11"
                    cy="20"
                    rx="5"
                    ry="11"
                    fill="white"
                    opacity="0.4"
                    transform="rotate(-20 11 20)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us — auto-scrolling */}
      <WhyUsScroll />

      {/* Browse by Category — from Firebase */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-wide text-hitham-gold">
              Explore
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-veda-green">
              Browse by Category
            </h2>
            <div className="mt-2 flex justify-center">
              <div className="h-0.5 w-16 bg-hitham-gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-cream-border bg-white p-5 text-center transition-all hover:border-hitham-gold hover:shadow-sm"
              >
                <span className="text-3xl">{CATEGORY_EMOJI[cat] || "🌿"}</span>
                <p className="text-xs font-semibold text-veda-green">{cat}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      {latest.length > 0 && (
        <section className="bg-parchment-dim py-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-hitham-gold">
                  New arrivals
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold text-veda-green">
                  Latest Products
                </h2>
                <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
              </div>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-veda-green hover:text-hitham-gold"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {latest.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ingredients Matter */}
      <IngredientsMatter />

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-hitham-gold">
                Most loved
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold text-veda-green">
                Best Sellers
              </h2>
              <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
            </div>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm font-medium text-veda-green hover:text-hitham-gold"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Meet the Founder */}
      <section className="bg-hitham-gold-dim py-14">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-hitham-gold">
                The heart behind Vedahitham
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-veda-green lg:text-4xl">
                Meet the Founder
              </h2>
              <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
              <p className="mt-5 text-base leading-relaxed text-ink-soft">
                Hi! I&apos;m{" "}
                <strong className="text-veda-green">Ashwini Reddy</strong>, a
                certified Ayurvedic Nutritionist. What began as my personal
                journey in my own kitchen has grown into a community proving
                healthy never has to be boring.
              </p>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                Every recipe carries my promise:{" "}
                <strong className="text-veda-green">
                  no junk, no chemicals, no sugar, no refined oils.
                </strong>
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-veda-green px-6 py-3 text-sm font-semibold text-parchment transition-colors hover:bg-veda-green-light"
              >
                Our full story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-72 w-72">
                <div className="absolute inset-0 rounded-full border-[8px] border-hitham-gold opacity-40" />
                <div className="absolute inset-3 overflow-hidden rounded-full bg-parchment-dim">
                  <Image
                    src="/founder.jpg"
                    alt="Ashwini Reddy - Founder"
                    fill
                    className="object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram / Social */}
      <section className="border-t border-cream-border bg-parchment py-12">
        <div className="mx-auto max-w-6xl px-5 text-center lg:px-8">
          <div className="flex items-center justify-center gap-2 text-veda-green">
            <Share2 className="h-5 w-5" />
            <p className="font-display text-xl font-bold">
              Follow us on Instagram
            </p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">@vedahitham</p>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <Link
                key={i}
                href="https://instagram.com/vedahitham"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden rounded-xl bg-parchment-dim border border-cream-border flex items-center justify-center text-ink-soft/40 hover:border-hitham-gold transition-colors"
              >
                <Share2 className="h-8 w-8" />
              </Link>
            ))}
          </div>
          <Link
            href="https://instagram.com/vedahitham"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-veda-green px-6 py-2.5 text-sm font-medium text-veda-green transition-colors hover:bg-veda-green hover:text-parchment"
          >
            <Share2 className="h-4 w-4" />
            Follow on Instagram
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-veda-green py-8">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { label: "100% Natural", sub: "No artificial anything" },
              { label: "Ayurvedic Roots", sub: "Ancient wisdom, modern meals" },
              { label: "No Compromise", sub: "Clean ingredients always" },
              { label: "Made with Joy", sub: "Every batch, handcrafted" },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-display text-lg font-bold text-hitham-gold">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-parchment/60">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
