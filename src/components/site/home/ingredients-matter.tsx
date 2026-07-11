const INGREDIENTS = [
  { name: "Almonds", emoji: "🥜", color: "#c8a882" },
  { name: "Jaggery", emoji: "🍯", color: "#c4902a" },
  { name: "Flax Seeds", emoji: "🌰", color: "#8b6914" },
  { name: "Pumpkin Seeds", emoji: "🎃", color: "#5a8a3a" },
  { name: "Ragi", emoji: "🌾", color: "#8b6914" },
  { name: "Pure Butter", emoji: "🧈", color: "#f5d060" },
];

export function IngredientsMatter() {
  return (
    <section
      className="relative overflow-hidden py-14"
      style={{
        background: "linear-gradient(135deg, #e8f5e8 0%, #f5faf0 40%, #fafaf0 70%, #f5f5e0 100%)",
      }}
    >
      {/* Yellow paint splash dots — decorative */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: "5%", left: "3%", size: 40, opacity: 0.6 },
          { top: "15%", right: "5%", size: 30, opacity: 0.5 },
          { top: "60%", left: "1%", size: 50, opacity: 0.4 },
          { bottom: "10%", right: "8%", size: 35, opacity: 0.6 },
          { top: "40%", right: "2%", size: 25, opacity: 0.5 },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-hitham-gold"
            style={{
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              top: dot.top,
              left: (dot as { left?: string }).left,
              right: (dot as { right?: string }).right,
              bottom: (dot as { bottom?: string }).bottom,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-5 lg:px-8">
        <h2 className="mb-10 text-center font-display text-4xl font-black text-veda-green lg:text-5xl">
          INGREDIENTS MATTER!
        </h2>

        {/* Central product image + surrounding ingredient circles */}
        <div className="relative flex items-center justify-center">
          {/* Central large circle */}
          <div className="relative z-10 flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border-4 border-hitham-gold bg-parchment-dim shadow-xl lg:h-64 lg:w-64">
            <span className="text-6xl">🍪</span>
            <p className="absolute bottom-3 text-xs font-bold text-veda-green">Our Product</p>
          </div>

          {/* Surrounding ingredient circles */}
          {INGREDIENTS.map((ingredient, i) => {
            const total = INGREDIENTS.length;
            const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
            const radius = 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={ingredient.name}
                className="absolute flex flex-col items-center gap-1"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div
                  className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md text-3xl lg:h-24 lg:w-24"
                  style={{ backgroundColor: ingredient.color + "22" }}
                >
                  {ingredient.emoji}
                </div>
                <p className="text-center text-[11px] font-semibold text-veda-green">
                  {ingredient.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom padding for ingredient labels */}
        <div className="mt-48 lg:mt-56" />

        <p className="text-center text-sm text-ink-soft max-w-lg mx-auto">
          Every ingredient we use is traceable, clean, and chosen with intention.
          No fillers. No preservatives. Just real food.
        </p>
      </div>
    </section>
  );
}
