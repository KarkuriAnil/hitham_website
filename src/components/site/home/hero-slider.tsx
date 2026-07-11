"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { image: "/hero-1.jpg" },
  { image: "/hero-2.jpg" },
  { image: "/hero-3.jpg" },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [current]);

  function goNext() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    setCurrent((c) => (c + 1) % SLIDES.length);
  }

  function goPrev() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }

  return (
    <section className="relative w-full overflow-hidden bg-veda-green">

      {/* MOBILE */}
      <div className="relative lg:hidden">
        {/* Slideshow on mobile */}
        <div className="relative w-full overflow-hidden" style={{ height: "280px" }}>
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={slide.image}
                alt={`Vedahitham banner ${i + 1}`}
                fill
                className="object-cover object-center"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-veda-green/70" />
            </div>
          ))}

          {/* Text over slideshow on mobile */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
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

          {/* Mobile nav arrows */}
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 py-3 bg-veda-green">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-hitham-gold" : "w-1.5 bg-parchment/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative hidden lg:block" style={{ minHeight: "520px" }}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={`Vedahitham banner ${i + 1}`}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />
            {/* Strong left gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(31,43,34,0.97) 0%, rgba(31,43,34,0.92) 35%, rgba(31,43,34,0.65) 55%, rgba(31,43,34,0.15) 75%, transparent 100%)",
              }}
            />
          </div>
        ))}

        {/* Desktop text */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-8 py-28">
          <div className="max-w-lg">
            <p className="font-display text-xl font-medium italic text-parchment/80">
              Changing The Way India Eats
            </p>
            <div className="mt-3 h-px w-48 bg-parchment/40" />
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-tight text-hitham-gold xl:text-7xl">
              VEDAHITHAM
            </h1>
            <div className="mt-3 h-px w-48 bg-parchment/40" />
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
                className="flex items-center gap-2 rounded-full border border-parchment/50 bg-parchment/10 px-7 py-3.5 text-sm font-medium text-parchment hover:bg-parchment/20 transition-colors"
              >
                Find your fit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop arrows */}
        <button
          onClick={goPrev}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Desktop dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-hitham-gold" : "w-2 bg-parchment/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
