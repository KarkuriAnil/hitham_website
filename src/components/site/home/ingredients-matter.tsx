"use client";

import { useEffect, useRef } from "react";

const INGREDIENTS = [
  { name: "Almonds", emoji: "🥜" },
  { name: "Jaggery", emoji: "🍯" },
  { name: "Flax Seeds", emoji: "🌰" },
  { name: "Pumpkin Seeds", emoji: "🎃" },
  { name: "Ragi", emoji: "🌾" },
  { name: "Pure Butter", emoji: "🧈" },
];

export function IngredientsMatter() {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    let angle = 0;
    let animationId: number;

    function animate() {
      angle += 0.3; // degrees per frame — lower = slower
      if (orbit) {
        orbit.style.transform = `rotate(${angle}deg)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const container = orbit.parentElement;
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

  const total = INGREDIENTS.length;

  return (
    <section
      className="relative overflow-hidden py-20"
      style={{
        background:
          "linear-gradient(135deg, #e8f5e8 0%, #f5faf0 40%, #fafaf0 70%, #f5f5e0 100%)",
      }}
    >
      {/* Decorative gold dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: "8%", left: "4%", size: 45 },
          { top: "70%", left: "2%", size: 30 },
          { bottom: "15%", left: "6%", size: 55 },
          { top: "10%", right: "5%", size: 35 },
          { top: "50%", right: "3%", size: 25 },
          { bottom: "8%", right: "6%", size: 40 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-hitham-gold opacity-50"
            style={{
              width: dot.size,
              height: dot.size,
              top: (dot as { top?: string }).top,
              left: (dot as { left?: string }).left,
              right: (dot as { right?: string }).right,
              bottom: (dot as { bottom?: string }).bottom,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
        {/* Title */}
        <h2 className="mb-16 text-center font-display text-4xl font-black text-veda-green lg:text-5xl">
          INGREDIENTS MATTER!
        </h2>

        {/* Orbit container */}
        <div className="relative mx-auto" style={{ width: 420, height: 420 }}>

          {/* Rotating orbit ring — holds ingredient circles */}
          <div
            ref={orbitRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            {INGREDIENTS.map((ingredient, i) => {
              const angleDeg = (i / total) * 360 - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const radius = 175;
              const cx = 210; // center x
              const cy = 210; // center y
              const x = cx + Math.cos(angleRad) * radius - 44; // 44 = half of circle width
              const y = cy + Math.sin(angleRad) * radius - 44;

              return (
                <div
                  key={ingredient.name}
                  className="absolute flex flex-col items-center gap-1"
                  style={{ left: x, top: y, width: 88 }}
                >
                  {/* Counter-rotate the label+emoji so they stay upright */}
                  <div
                    className="flex flex-col items-center gap-1"
                    style={{
                      animation: "counter-rotate linear infinite",
                      animationDuration: "inherit",
                    }}
                  >
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-parchment shadow-md text-3xl">
                      {ingredient.emoji}
                    </div>
                    <p className="text-center text-[11px] font-semibold text-veda-green whitespace-nowrap">
                      {ingredient.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center product circle — stays fixed */}
          <div
            className="absolute flex flex-col items-center justify-center overflow-hidden rounded-full border-4 border-hitham-gold bg-parchment shadow-xl"
            style={{
              width: 180,
              height: 180,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <span className="text-5xl">🍪</span>
            <p className="mt-1 text-xs font-bold text-veda-green">Our Product</p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mx-auto mt-16 max-w-lg text-center text-sm text-ink-soft">
          Every ingredient is traceable, clean, and chosen with intention.
          No fillers. No preservatives. Just real food.
        </p>
      </div>

      {/* CSS for counter-rotation so labels stay readable */}
      <style>{`
        @keyframes counter-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  );
}
