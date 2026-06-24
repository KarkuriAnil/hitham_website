import Link from "next/link";

const GOALS = [
  { label: "Diabetes", emoji: "🌾" },
  { label: "Weight Loss", emoji: "⚖️" },
  { label: "Gut Health", emoji: "🌿" },
  { label: "PCOS", emoji: "🌸" },
  { label: "Detox", emoji: "💧" },
  { label: "Healthy Lifestyle", emoji: "🌞" },
];

export function GoalGrid() {
  return (
    <section className="bg-ivory-dim py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs uppercase tracking-wide text-ink-soft">Eat for your goal</p>
        <h2 className="growth-line mt-1 inline font-display text-2xl font-medium text-ink lg:text-3xl">
          What are you working on?
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {GOALS.map((goal) => (
            <Link
              key={goal.label}
              href={`/recommendations?goal=${encodeURIComponent(goal.label)}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border-soft bg-ivory p-5 text-center transition-colors hover:border-sage"
            >
              <span className="text-2xl">{goal.emoji}</span>
              <span className="text-sm font-medium text-ink">{goal.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
