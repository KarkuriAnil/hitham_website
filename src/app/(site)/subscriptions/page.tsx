"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getStorefrontPlans } from "@/lib/site/subscriptions";
import type { SubscriptionPlan } from "@/types";

type ExtendedPlan = SubscriptionPlan & {
  tier?: string;
  breakfastPrice?: number;
  lunchPrice?: number;
  dinnerPrice?: number;
  description?: string;
};

const TIER_ACCENT: Record<string, { border: string; badge: string; button: string }> = {
  Basic: {
    border: "border-t-4 border-t-sage",
    badge: "bg-sage-dim text-veda-green border-sage-light",
    button: "bg-veda-green text-parchment hover:bg-veda-green-light",
  },
  Premium: {
    border: "border-t-4 border-t-hitham-gold",
    badge: "bg-hitham-gold-dim text-veda-green border-hitham-gold/30",
    button: "bg-hitham-gold text-veda-green-dark hover:bg-hitham-gold-light font-semibold",
  },
  Elite: {
    border: "border-t-4 border-t-night-earth",
    badge: "bg-night-earth text-parchment border-night-earth",
    button: "bg-night-earth text-parchment hover:bg-night-earth-soft",
  },
  "Add-on": {
    border: "border-t-4 border-t-clay",
    badge: "bg-clay-dim text-clay border-clay/30",
    button: "bg-clay text-parchment hover:bg-clay/90",
  },
};

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<ExtendedPlan[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStorefrontPlans()
      .then((data) => { if (!cancelled) setPlans(data as ExtendedPlan[]); })
      .catch(() => { if (!cancelled) setPlans([]); });
    return () => { cancelled = true; };
  }, []);

  // Separate add-ons from main plans
  const mainPlans = plans?.filter((p) => p.tier !== "Add-on") ?? [];
  const addOns = plans?.filter((p) => p.tier === "Add-on") ?? [];

  return (
    <div className="bg-parchment">

      {/* Hero */}
      <section className="border-b border-cream-border bg-veda-green py-16 text-center text-parchment">
        <p className="text-xs uppercase tracking-[0.3em] text-hitham-gold">28-Day Diet Program</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-parchment lg:text-5xl">
          Choose Your Plan
        </h1>
        <div className="brand-rule mx-auto mt-3 max-w-xs text-xs text-hitham-gold" />
        <p className="mx-auto mt-5 max-w-xl text-sm text-parchment/75 leading-relaxed">
          Vedahitham's 28-day programs are built around Ayurvedic principles — clean meals,
          no chemicals, no refined oils, no sugar. Just real food made with care.
        </p>
      </section>

      {/* Main plans */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        {plans === null ? (
          <p className="text-center text-sm text-ink-soft py-16">Loading plans…</p>
        ) : mainPlans.length === 0 ? (
          <p className="text-center text-sm text-ink-soft py-16">
            No plans available yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainPlans.map((plan) => {
              const tier = plan.tier || "Basic";
              const style = TIER_ACCENT[tier] || TIER_ACCENT["Basic"];
              const hasMeals = plan.breakfastPrice || plan.lunchPrice || plan.dinnerPrice;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border border-cream-border bg-white overflow-hidden shadow-sm ${style.border}`}
                >
                  {/* Header */}
                  <div className="p-6 pb-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}>
                      {tier}
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-bold text-veda-green">
                      {plan.title}
                    </h3>
                    {plan.description && (
                      <p className="mt-1 text-xs text-ink-soft">{plan.description}</p>
                    )}
                    <p className="mt-1 text-xs text-ink-soft">{plan.targetGoal}</p>
                  </div>

                  {/* Meal breakdown */}
                  {hasMeals && (
                    <div className="mx-5 mb-4 rounded-xl bg-parchment-dim p-4">
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-hitham-gold font-semibold">
                        Per meal · Monthly
                      </p>
                      <div className="flex flex-col gap-2">
                        {plan.breakfastPrice ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-ink-soft">
                              <span>🌅</span> Breakfast
                            </span>
                            <span className="font-semibold text-veda-green">{fmt(plan.breakfastPrice)}</span>
                          </div>
                        ) : null}
                        {plan.lunchPrice ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-ink-soft">
                              <span>☀️</span> Lunch
                            </span>
                            <span className="font-semibold text-veda-green">{fmt(plan.lunchPrice)}</span>
                          </div>
                        ) : null}
                        {plan.dinnerPrice ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-ink-soft">
                              <span>🌙</span> Dinner
                            </span>
                            <span className="font-semibold text-veda-green">{fmt(plan.dinnerPrice)}</span>
                          </div>
                        ) : null}
                        <div className="mt-1 flex items-center justify-between border-t border-cream-border pt-2">
                          <span className="text-sm font-bold text-veda-green">Combo (28 days)</span>
                          <span className="font-display text-lg font-bold text-veda-green">
                            {fmt(plan.monthlyPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Weekly / Monthly / Quarterly */}
                  <div className="mx-5 mb-4 grid grid-cols-3 divide-x divide-cream-border rounded-xl border border-cream-border text-center">
                    <div className="py-3 px-2">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">Weekly</p>
                      <p className="mt-0.5 font-display text-sm font-bold text-veda-green">{fmt(plan.weeklyPrice)}</p>
                    </div>
                    <div className="py-3 px-2">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">Monthly</p>
                      <p className="mt-0.5 font-display text-sm font-bold text-veda-green">{fmt(plan.monthlyPrice)}</p>
                    </div>
                    <div className="py-3 px-2">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">Quarterly</p>
                      <p className="mt-0.5 font-display text-sm font-bold text-veda-green">{fmt(plan.quarterlyPrice)}</p>
                    </div>
                  </div>

                  {/* Includes */}
                  {plan.benefits.length > 0 && (
                    <div className="mx-5 mb-5">
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-hitham-gold font-semibold">
                        Includes
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {plan.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-2 text-xs text-ink-soft">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-veda-green" />
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto p-5 pt-0">
                    <Link
                      href={`/subscriptions/${plan.id}`}
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm transition-colors ${style.button}`}
                    >
                      Choose {tier} Plan <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <section className="border-t border-cream-border bg-parchment-dim py-12">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <p className="text-xs uppercase tracking-wide text-hitham-gold">Enhance your plan</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-veda-green">Add-ons</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addOns.map((plan) => (
                <div key={plan.id} className="rounded-xl border border-cream-border bg-white p-5">
                  <p className="font-display text-lg font-bold text-veda-green">{plan.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{plan.targetGoal}</p>
                  <p className="mt-3 font-display text-2xl font-bold text-hitham-gold">
                    {fmt(plan.monthlyPrice)}
                  </p>
                  <Link
                    href={`/subscriptions/${plan.id}`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-veda-green py-2.5 text-sm text-veda-green hover:bg-veda-green hover:text-parchment transition-colors"
                  >
                    Add to plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promise bar */}
      <section className="border-t border-cream-border bg-veda-green py-10 text-center text-parchment">
        <p className="font-display text-xl font-bold text-hitham-gold">Ashwini Reddy's Promise</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {["No junk", "No chemicals", "No sugar", "No refined oils", "No compromises"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-hitham-gold/40 px-4 py-1.5 text-xs text-parchment/90"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-parchment/60">Just real food made with care and joy.</p>
      </section>
    </div>
  );
}
