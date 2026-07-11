"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { image: "/hero-1.jpg" },
  { image: "/hero-2.jpg" },
  { image: "/hero-3.jpg" },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(goNext, 4000);
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

  return (
    <section className="relative w-full overflow-hidden bg-veda-green">

      {/* Slides — pure image, no text, no overlay */}
      <div
        className="relative w-full"
        style={{ height: "clamp(220px, 55vw, 580px)" }}
      >
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
          </div>
        ))}

        {/* Left arrow */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-7 h-2 bg-hitham-gold"
                  : "w-2 h-2 bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
