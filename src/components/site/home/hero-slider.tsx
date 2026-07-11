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

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 4000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const TextContent = ({ mobile }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col items-center text-center" : "max-w-lg"}>
      <p className="font-display text-base font-medium italic text-parchment/80 lg:text-xl">
        Changing The Way India Eats
      </p>
      <div className={`mt-2 h-px w-36 bg-parchment/40 ${mobile ? "mx-auto" : ""}`} />
      <h1 className="mt-3 font-display text-4xl font-black uppercase leading-tight text-hitham-gold lg:text-6xl xl:text-7xl">
        VEDAHITHAM
      </h1>
      <div className={`mt-3 h-px w-36 bg-parchment/40 ${mobile ? "mx-auto" : ""}`} />
      <p className="mt-3 font-display text-base font-semibold text-parchment lg:text-xl">
        More than a food — It&apos;s a Lifestyle
      </p>
      <div className={`mt-7 flex flex-wrap gap-3 ${mobile ? "justify-center" : ""}`}>
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-full bg-hitham-gold px-6 py-3 text-sm font-bold text-veda-green transition-colors hover:bg-hitham-gold-light"
        >
          <ShoppingBag className="h-4 w-4" />
          Shop now
        </Link>
        <Link
          href="/recommendations"
          className="flex items-center gap-2 rounded-full border border-parchment/50 bg-parchment/10 px-6 py-3 text-sm font-medium text-parchment transition-colors hover:bg-parchment/20"
        >
          Find your fit <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-veda-green">

      {/* ── MOBILE ── */}
      <div className="lg:hidden">
        {/* Slideshow image — only left portion, cropped to hide right-side text */}
        <div className="relative w-full overflow-hidden" style={{ height: "260px" }}>
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={slide.image}
                alt={`Vedahitham slide ${i + 1}`}
                fill
                className="object-cover object-left-top scale-110"
                priority={i === 0}
              />
              {/* Full dark overlay on mobile — hides all baked-in image text */}
              <div className="absolute inset-0 bg-veda-green/85" />
            </div>
          ))}

          {/* Our text on top */}
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
            <TextContent mobile />
          </div>

          {/* Arrows */}
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 bg-veda-green py-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-6 bg-hitham-gold" : "w-1.5 bg-parchment/30"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="relative hidden lg:block" style={{ minHeight: "520px" }}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={`Vedahitham slide ${i + 1}`}
              fill
              className="object-cover object-left-top"
              priority={i === 0}
            />
            {/* Very strong gradient — covers entire right half where text is baked in */}
            <div
              className="absolute inset-0"
              style={{
                background: [
                  "linear-gradient(to right,",
                  "rgba(31,43,34,0.98) 0%,",
                  "rgba(31,43,34,0.96) 30%,",
                  "rgba(31,43,34,0.90) 45%,",
                  "rgba(31,43,34,0.80) 55%,",
                  "rgba(31,43,34,0.95) 65%,",   /* goes dark again to hide right text */
                  "rgba(31,43,34,0.98) 75%,",
                  "rgba(31,43,34,1.00) 100%",
                  ")",
                ].join(" "),
              }}
            />
          </div>
        ))}

        {/* Our text */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-8 py-28">
          <TextContent />
        </div>

        {/* Arrows */}
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

        {/* Dots */}
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
