"use client";

import { useEffect, useRef, useState } from "react";

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
  const [size, setSize] = useState(340);

  // Responsive orbit size
  useEffect(() => {
    function updateSize() {
      const w = window.innerWidth;
      if (w < 400) setSize(260);
      else if (w < 640) setSize(300);
      else if (w < 1024) setSize(340);
      else setSize(420);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    let angle = 0;
    let animationId: number;

    function animate() {
      angle += 0.25;
      if (orbit) {
        orbit.style.transform = `rotate(${angle}deg)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

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
  const center = size / 2;
  const radius = size * 0.38;
  const circleSize = size < 300 ? 52 : size < 380 ? 60 : 72;
  const centerCircle = size * 0.38;
  const fontSize = size < 300 ? "text-[9px]" : "text-[11px]";
  const centerEmoji = size < 300 ? "text-3xl" : "text-5xl";

  return (
    <section
      className="relative overflow-hidden py-12 lg:py-20"
      style={{
        background: "linear-gradient(135deg, #e8f5e8 0%, #f5faf0 40%, #fafaf0 70%, #f5f5e0 100%)",
      }}
    >
      {/* Decorative gold dots — only on larger screens */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        {[
          { top: "8%", left: "3%", size: 40 },
          { top: "70%", left: "2%", size: 28 },
          { bottom: "12%", left: "5%", size: 48 },
          { top: "10%", right: "4%", size: 32 },
          { bottom: "8%", right: "5%", size: 36 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-hitham-gold opacity-40"
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

      <div className="relative mx-auto px-4 lg:px-8" style={{ maxWidth: "100%" }}>
        {/* Title */}
        <h2 className="mb-8 text-center font-display text-3xl font-black text-veda-green lg:mb-12 lg:text-5xl">
          INGREDIENTS MATTER!
        </h2>

        {/* Orbit container — centered, responsive size */}
        <div
          className="relative mx-auto"
          style={{ width: size, height: size }}
        >
          {/* Rotating orbit ring */}
          <div
            ref={orbitRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: "center center" }}
          >
            {INGREDIENTS.map((ingredient, i) => {
              const angleDeg = (i / total) * 360 - 90;
              const angleRad = (angleDeg * Math.PI) / 180;
              const x = center + Math.cos(angleRad) * radius - circleSize / 2;
              const y = center + Math.sin(angleRad) * radius - circleSize / 2;

              return (
                <div
                  key={ingredient.name}
                  className="absolute flex flex-col items-center"
                  style={{ left: x, top: y, width: circleSize }}
                >
                  {/* Counter-rotate so labels stay upright */}
                  <div
                    style={{
                      animation: `counter-spin ${360 / 0.25 / 60}s linear infinite`,
                    }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div
                      className="flex items-center justify-center overflow-hidden rounded-full border-2 border-white bg-parchment shadow-md"
                      style={{
                        width: circleSize,
                        height: circleSize,
                        fontSize: circleSize * 0.4,
                      }}
                    >
                      {ingredient.emoji}
                    </div>
                    <p
                      className={`text-center font-semibold text-veda-green whitespace-nowrap ${fontSize}`}
                    >
                      {ingredient.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center product circle — fixed */}
          <div
            className="absolute flex flex-col items-center justify-center overflow-hidden rounded-full border-4 border-hitham-gold bg-parchment shadow-xl"
            style={{
              width: centerCircle,
              height: centerCircle,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <span className={centerEmoji}>🍪</span>
            <p className={`font-bold text-veda-green ${fontSize}`}>
              Our Product
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mx-auto mt-8 max-w-md text-center text-sm text-ink-soft px-4">
          Every ingredient is traceable, clean, and chosen with intention.
          No fillers. No preservatives. Just real food.
        </p>
      </div>

      {/* CSS counter-rotation keyframes */}
      <style>{`
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  );
}
