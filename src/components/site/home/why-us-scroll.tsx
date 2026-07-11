"use client";

import { useEffect, useRef } from "react";

const BADGES = [
  { label: "Gluten Free", emoji: "🌾" },
  { label: "Sugar Free", emoji: "🚫" },
  { label: "100% Natural", emoji: "🌿" },
  { label: "Trans Fat Free", emoji: "💚" },
  { label: "Chemicals Free", emoji: "⚗️" },
  { label: "No Colorants", emoji: "🎨" },
  { label: "Palm Oil Free", emoji: "🌴" },
  { label: "Egg Free", emoji: "🥚" },
];

// Duplicate badges so the scroll loops seamlessly
const DOUBLED = [...BADGES, ...BADGES, ...BADGES];

export function WhyUsScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.5; // px per frame — adjust for faster/slower
    const totalWidth = track.scrollWidth / 3; // one set width

    function animate() {
      position += speed;
      if (position >= totalWidth) {
        position = 0;
      }
      track.style.transform = `translateX(-${position}px)`;
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const container = track.parentElement;
    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => { animationId = requestAnimationFrame(animate); };
    container?.addEventListener("mouseenter", pause);
    container?.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationId);
      container?.removeEventListener("mouseenter", pause);
      container?.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-cream-border bg-gradient-to-br from-[#e8f5f0] via-[#f0faf5] to-[#e8f5f0] py-8 mx-4 my-6 lg:mx-8">
      <h2 className="mb-6 text-center font-display text-2xl font-bold text-veda-green">
        Why Us?
      </h2>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-8 w-max will-change-transform">
          {DOUBLED.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 text-center"
              style={{ minWidth: "80px" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm text-3xl">
                {badge.emoji}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-veda-green leading-tight">
                {badge.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
