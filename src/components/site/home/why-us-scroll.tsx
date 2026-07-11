"use client";

import { useEffect, useRef } from "react";

const BADGES = [
  { label: "100% Natural", emoji: "🌿" },
  { label: "Sugar Free", emoji: "🚫" },
  { label: "No Added Preservatives", emoji: "✅" },
  { label: "Zero Refined Oil", emoji: "🫙" },
  { label: "Low Carb", emoji: "⚖️" },
  { label: "Gluten Free", emoji: "🌾" },
  { label: "Trans Fats Free", emoji: "💚" },
];

const TRIPLED = [...BADGES, ...BADGES, ...BADGES];

export function WhyUsScroll() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;
    const speed = 0.6;

    function getTotal() {
      return track ? track.scrollWidth / 3 : 0;
    }

    function animate() {
      position += speed;
      const total = getTotal();
      if (total > 0 && position >= total) {
        position = 0;
      }
      if (track) {
        track.style.transform = `translateX(-${position}px)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    const container = track.parentElement;
    function pause() { cancelAnimationFrame(animationId); }
    function resume() { animationId = requestAnimationFrame(animate); }
    container?.addEventListener("mouseenter", pause);
    container?.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animationId);
      container?.removeEventListener("mouseenter", pause);
      container?.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <section className="mx-4 my-6 overflow-hidden rounded-2xl border border-cream-border lg:mx-8"
      style={{ background: "linear-gradient(135deg, #e0f5ee 0%, #f0faf5 50%, #e8f5f0 100%)" }}
    >
      <h2 className="pt-6 text-center font-display text-2xl font-bold text-veda-green">
        Why Us?
      </h2>
      <div className="overflow-hidden py-6">
        <div
          ref={trackRef}
          className="flex gap-10 w-max will-change-transform"
          style={{ paddingLeft: "40px" }}
        >
          {TRIPLED.map((badge, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 text-center"
              style={{ minWidth: "90px" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white shadow-md text-3xl">
                {badge.emoji}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-veda-green leading-tight">
                {badge.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
