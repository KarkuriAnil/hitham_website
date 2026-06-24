import Link from "next/link";
import { ProductCard } from "@/components/site/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RecommendationResult } from "@/lib/site/recommendations";

export function RecommendationResults({ result }: { result: RecommendationResult }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Your BMI" value={result.bmi.toFixed(1)} sub={result.bmiCategory} />
        <StatTile
          label="Daily calorie target"
          value={`${result.nutritionTarget.calories.toLocaleString("en-IN")} kcal`}
        />
        <StatTile
          label="Protein target"
          value={`${result.nutritionTarget.protein} g`}
          sub={`${result.nutritionTarget.carbs}g carbs · ${result.nutritionTarget.fat}g fat`}
        />
      </div>

      <div>
        <p className="mb-3 font-display text-lg text-ink">Guidance for you</p>
        <ul className="flex flex-col gap-2">
          {result.guidance.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-ink-soft">
              <span className="text-success">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 font-display text-lg text-ink">A typical day</p>
        <div className="flex flex-col gap-2">
          {result.mealSchedule.map((slot) => (
            <div
              key={slot.label}
              className="flex items-center justify-between rounded-lg border border-border-soft p-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{slot.label}</p>
                <p className="text-xs text-ink-soft">{slot.suggestion}</p>
              </div>
              <span className="text-xs text-ink-soft">{slot.time}</span>
            </div>
          ))}
        </div>
      </div>

      {result.recommendedProducts.length > 0 && (
        <div>
          <p className="mb-3 font-display text-lg text-ink">Recommended for you</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {result.recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {result.recommendedPlans.length > 0 && (
        <div>
          <p className="mb-3 font-display text-lg text-ink">Plans that fit</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.recommendedPlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border-soft p-5">
                <Badge variant="outline">{plan.diseaseType}</Badge>
                <p className="mt-2 font-medium text-ink">{plan.title}</p>
                <p className="text-sm text-ink-soft">{plan.targetGoal}</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href={`/subscriptions/${plan.id}`}>View plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-ivory-dim p-5">
      <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}
