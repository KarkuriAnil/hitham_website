"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
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

  const FALLBACK_CATEGORIES = [
    { label: "Detox Drinks", emoji: "🍵" },
    { label: "Millet Products", emoji: "🌾" },
    { label: "Breakfast Kits", emoji: "🍳" },
    { label: "Superfoods", emoji: "🥗" },
    { label: "Beverages", emoji: "🥤" },
    { label: "Snacks", emoji: "🫘" },
  ];

  const displayCategories =
    categories.length > 0
      ? categories.map((c) => ({ label: c, emoji: CATEGORY_EMOJI[c] || "🌿" }))
      : FALLBACK_CATEGORIES;

  return (
    <div className="bg-parchment">

      {/* Announcement bar */}
      <div className="bg-hitham-gold py-2 text-center text-xs font-bold text-veda-green">
        🌿 FREE shipping on all orders above ₹999 &nbsp;·&nbsp; No junk. No chemicals. No compromises.
      </div>

      {/* Hero — full width banner with image on right */}
      <section className="relative w-full overflow-hidden bg-veda-green">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col lg:hidden">
          {/* Mobile hero image — full width */}
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/hero-food.jpg"
              alt="Vedahitham fresh ingredients"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay so text is readable */}
            <div className="absolute inset-0 bg-veda-green/70" />
            {/* Text over image on mobile */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="font-display text-sm font-medium italic text-parchment/80">
                Changing The Way India Eats
              </p>
              <div className="my-2 h-px w-32 bg-parchment/40" />
              <h1 className="font-display text-3xl font-black uppercase text-hitham-gold">
                VEDAHITHAM
              </h1>
              <div className="my-2 h-px w-32 bg-parchment/40" />
              <p className="font-display text-sm font-semibold text-parchment">
                More than a food — It&apos;s a Lifestyle
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="flex items-center gap-2 rounded-full bg-hitham-gold px-5 py-2.5 text-xs font-bold text-veda-green"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Shop now
                </Link>
                <Link
                  href="/recommendations"
                  className="flex items-center gap-2 rounded-full border border-parchment/50 px-5 py-2.5 text-xs font-medium text-parchment"
                >
                  Find your fit <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: side by side */}
        <div className="hidden lg:flex max-w-6xl mx-auto items-center px-8 py-24">
          {/* Left text */}
          <div className="flex-1 pr-12">
            <p className="font-display text-xl font-medium italic text-parchment/70">
              Changing The Way India Eats
            </p>
            <div className="mt-3 h-px w-48 bg-parchment/30" />
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-tight text-hitham-gold xl:text-7xl">
              VEDAHITHAM
            </h1>
            <div className="mt-3 h-px w-48 bg-parchment/30" />
            <p className="mt-4 font-display text-xl font-semibold text-parchment">
              More than a food — It&apos;s a Lifestyle
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="flex items-center gap-2 rounded-full bg-hitham-gold px-7 py-3.5 text-sm font-bold text-veda-green hover:bg-hitham-gold-light transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Shop now
              </Link>
              <Link
                href="/recommendations"
                className="flex items-center gap-2 rounded-full border border-parchment/40 px-7 py-3.5 text-sm font-medium text-parchment hover:bg-parchment/10 transition-colors"
              >
                Find your fit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right circular image */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative h-[420px] w-[420px]">
              <div className="absolute inset-0 rounded-full border-[12px] border-hitham-gold opacity-50" />
              <div className="absolute inset-5 rounded-full border-[6px] border-hitham-gold opacity-30" />
              <div className="absolute inset-9 overflow-hidden rounded-full">
                <Image
                  src="/hero-food.jpg"
                  alt="Fresh Ayurvedic ingredients"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -right-3 top-10">
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <ellipse cx="22" cy="11" rx="7" ry="14" fill="#C59C44" opacity="0.9" transform="rotate(-30 22 11)" />
                  <ellipse cx="30" cy="25" rx="7" ry="14" fill="#C59C44" opacity="0.6" transform="rotate(20 30 25)" />
                </svg>
              </div>
              <div className="absolute -left-3 bottom-14">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <ellipse cx="18" cy="9" rx="5" ry="11" fill="white" opacity="0.7" transform="rotate(20 18 9)" />
                  <ellipse cx="11" cy="20" rx="5" ry="11" fill="white" opacity="0.4" transform="rotate(-20 11 20)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us scrolling */}
      <WhyUsScroll />

      {/* Browse by Category */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-wide text-hitham-gold">Explore</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-veda-green lg:text-3xl">
            Browse by Category
          </h2>
          <div className="mt-2 flex justify-center">
            <div className="h-0.5 w-16 bg-hitham-gold" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat.label}
              href={`/products?category=${encodeURIComponent(cat.label)}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-cream-border bg-white p-4 text-center transition-all hover:border-hitham-gold hover:shadow-md"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <p className="text-[10px] font-semibold leading-tight text-veda-green lg:text-xs">
                {cat.label}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      {latest.length > 0 && (
        <section className="bg-parchment-dim py-12">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-hitham-gold">New arrivals</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-veda-green">
                  Latest Products
                </h2>
                <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-veda-green hover:text-hitham-gold">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {latest.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Ingredients Matter */}
      <IngredientsMatter />

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-hitham-gold">Most loved</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-veda-green">
                Best Sellers
              </h2>
              <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-veda-green hover:text-hitham-gold">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Meet the Founder */}
      <section className="bg-hitham-gold-dim py-12">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs uppercase tracking-wide text-hitham-gold">
                The heart behind Vedahitham
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-veda-green lg:text-4xl">
                Meet the Founder
              </h2>
              <div className="mt-1 h-0.5 w-16 bg-hitham-gold" />
              <p className="mt-4 text-sm leading-relaxed text-ink-soft lg:text-base">
                Hi! I&apos;m <strong className="text-veda-green">Ashwini Reddy</strong>, a
                certified Ayurvedic Nutritionist. What began as my personal journey in my
                own kitchen has grown into a community proving healthy never has to be boring.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft lg:text-base">
                Every recipe carries my promise:{" "}
                <strong className="text-veda-green">
                  no junk, no chemicals, no sugar, no refined oils.
                </strong>
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-veda-green px-6 py-3 text-sm font-semibold text-parchment hover:bg-veda-green-light transition-colors"
              >
                Our full story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="order-1 flex items-center justify-center lg:order-2">
              <div className="relative h-56 w-56 lg:h-72 lg:w-72">
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

      {/* Instagram — real links with actual Instagram icon SVG */}
      <section className="border-t border-cream-border bg-parchment py-12">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-6 w-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <p className="font-display text-xl font-bold text-veda-green">
              Follow us on Instagram
            </p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">@vedahitham</p>

          {/* Instagram grid — 3 placeholder boxes with Instagram colors */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { bg: "from-purple-400 via-pink-500 to-orange-400", label: "Our products" },
              { bg: "from-yellow-400 via-orange-400 to-pink-500", label: "Behind the scenes" },
              { bg: "from-green-400 via-teal-400 to-blue-400", label: "Healthy recipes" },
            ].map((item, i) => (
              <Link
                key={i}
                href="https://www.instagram.com/vedahitham"
                target="_blank"
                rel="noopener noreferrer"
                className={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${item.bg} flex items-center justify-center hover:opacity-90 transition-opacity`}
              >
                <div className="flex flex-col items-center gap-1 text-white">
                  <svg className="h-8 w-8 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <p className="text-[10px] font-semibold">{item.label}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="https://www.instagram.com/vedahitham"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-veda-green px-6 py-2.5 text-sm font-medium text-veda-green hover:bg-veda-green hover:text-parchment transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Follow on Instagram
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-veda-green py-8">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {[
              { label: "100% Natural", sub: "No artificial anything" },
              { label: "Ayurvedic Roots", sub: "Ancient wisdom, modern meals" },
              { label: "No Compromise", sub: "Clean ingredients always" },
              { label: "Made with Joy", sub: "Every batch, handcrafted" },
            ].map((item) => (
              <div key={item.label} className="px-2">
                <p className="font-display text-sm font-bold text-hitham-gold lg:text-lg">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[10px] text-parchment/60 lg:text-xs">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
