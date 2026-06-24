"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HealthProfileForm } from "@/components/site/recommendations/health-profile-form";
import { RecommendationResults } from "@/components/site/recommendations/recommendation-results";
import { getStorefrontProducts } from "@/lib/site/products";
import { getStorefrontPlans } from "@/lib/site/subscriptions";
import { getRecommendations, type HealthProfileInput, type RecommendationResult } from "@/lib/site/recommendations";

function RecommendationsInner() {
  const searchParams = useSearchParams();
  const defaultGoal = searchParams.get("goal") || undefined;
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(input: HealthProfileInput) {
    setLoading(true);
    try {
      const [products, plans] = await Promise.all([getStorefrontProducts(), getStorefrontPlans()]);
      setResult(getRecommendations(input, products, plans));
    } catch (err) {
      console.error("Failed to compute recommendations", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-ink-soft">Find your fit</p>
        <h1 className="growth-line mt-1 inline font-display text-3xl font-medium text-ink">
          Tell us about you
        </h1>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          A few details, and we&apos;ll suggest meals and plans that actually match your goal.
        </p>
      </div>

      {!result ? (
        <HealthProfileForm defaultGoal={defaultGoal} onSubmit={handleSubmit} />
      ) : (
        <>
          <button
            onClick={() => setResult(null)}
            className="mb-6 text-sm text-ink-soft hover:text-ink"
          >
            ← Edit my details
          </button>
          <RecommendationResults result={result} />
        </>
      )}

      {loading && <p className="mt-4 text-sm text-ink-soft">Crunching the numbers…</p>}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<div className="px-5 py-16 text-sm text-ink-soft">Loading…</div>}>
      <RecommendationsInner />
    </Suspense>
  );
}
