"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const INGREDIENTS = [
  { name: "Millets", image: "/ingredients/millets.jpg" },
  { name: "Desi Rice", image: "/ingredients/desi-rice.jpg" },
  { name: "Wood Pressed Oils", image: "/ingredients/wood-pressed-oils.jpg" },
  { name: "Stevia & Monk Fruit", image: "/ingredients/stevia.jpg" },
  { name: "Palm Jaggery", image: "/ingredients/palm-jaggery.jpg" },
  { name: "Non-Iodised Salt", image: "/ingredients/salt.jpg" },
  { name: "Protein Pulses", image: "/ingredients/pulses.jpg" },
  { name: "Ayurvedic Herbs", image: "/ingredients/herbs.jpg" },
];

export function IngredientsMatter() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const [size, setSize] = useState(340);

  useEffect(() => {
    function updateSize() {
      const w = window.innerWidth;
      if (w < 400) setSize(260);
      else if (w < 640) setSize(300);
      else if (w < 1024) setSize(360);
      else setSize(460);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit) return;

    let animationId: number;

    function animate() {
      angleRef.current += 0.2;
      if (orbit) {
        orbit.style.transform = `rotate(${angleRef.current}deg)`;
        const children = orbit.querySelectorAll<HTMLElement>(".ingredient-inner");
        children.forEach((child) => {
          child.style.transform = `rotate(-${angleRef.current}deg)`;
        });
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
  const radius = size * 0.40;
  const circleSize = size < 300 ? 56 : size < 400 ? 64 : size < 500 ? 76 : 88;
  const centerSize = size * 0.36;
  const fontSize = size < 300 ? "text-[8px]" : size < 400 ? "text-[9px]" : "text-[11px]";

  return (
    <section
      className="relative overflow-hidden py-12 lg:py-20"
      style={{
        background:
          "linear-gradient(135deg, #e8f5e8 0%, #f5faf0 40%, #fafaf0 70%, #f5f5e0 100%)",
      }}
    >
      {/* Decorative gold dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        {[
          { top: "8%", left: "3%", s: 40 },
          { top: "70%", left: "2%", s: 28 },
          { bottom: "12%", left: "5%", s: 48 },
          { top: "10%", right: "4%", s: 32 },
          { bottom: "8%", right: "5%", s: 36 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-hitham-gold opacity-40"
            style={{
              width: dot.s,
              height: dot.s,
              top: (dot as { top?: string }).top,
              left: (dot as { left?: string }).left,
              right: (dot as { right?: string }).right,
              bottom: (dot as { bottom?: string }).bottom,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto px-4 lg:px-8">
        <h2 className="mb-10 text-center font-display text-3xl font-black text-veda-green lg:text-5xl">
          INGREDIENTS MATTER!
        </h2>

        <div
          className="relative mx-auto"
          style={{ width: size, height: size }}
        >
          {/* Rotating ring with ingredients */}
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
                  className="absolute"
                  style={{ left: x, top: y, width: circleSize }}
                >
                  <div
                    className="ingredient-inner flex flex-col items-center gap-1"
                    style={{ transformOrigin: "center center" }}
                  >
                    <div
                      className="overflow-hidden rounded-full border-2 border-white bg-parchment shadow-lg"
                      style={{ width: circleSize, height: circleSize }}
                    >
                      <Image
                        src={ingredient.image}
                        alt={ingredient.name}
                        width={circleSize}
                        height={circleSize}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p
                      className={`text-center font-semibold text-veda-green whitespace-nowrap leading-tight ${fontSize}`}
                      style={{ maxWidth: circleSize + 20 }}
                    >
                      {ingredient.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center — Vedahitham LOGO instead of cookie emoji */}
          <div
            className="absolute z-10 flex items-center justify-center overflow-hidden rounded-full border-4 border-hitham-gold bg-parchment shadow-2xl"
            style={{
              width: centerSize,
              height: centerSize,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src="/logo.png"
              alt="Vedahitham"
              width={centerSize * 0.9}
              height={centerSize * 0.9}
              className="object-contain p-2"
            />
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-sm text-ink-soft px-4">
          Every ingredient is traceable, clean, and chosen with intention.
          No fillers. No preservatives. Just real food.
        </p>
      </div>
    </section>
  );
}
