"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Phone, Mail, Clock } from "lucide-react";
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

const MENU = {
  breakfast: [
    "Millets Idli",
    "Millets Dosa",
    "Sprouts Salad",
    "Overnight Oats",
    "Avocado Toast",
    "Millets Pongal",
    "Ragi Ambali",
    "Jonna Ambali",
    "Rice Kanji (Fermented Rice)",
    "Millets Kanji (Fermented Millets)",
    "Oats Smoothie Bowls",
    "Millets Upma",
    "Boiled Eggs",
  ],
  lunch: [
    "South Indian Thali",
    "Millets",
    "Quinoa",
    "Brown Rice",
    "Red Rice",
    "Black Rice",
    "Vegetable Curries",
    "Chicken Curries",
    "Chicken Pulao",
    "Brown Rice Chicken Biryani",
    "Zero Oil Biryani",
  ],
  dinner: [
    "Rotis",
    "Salads (Veg & Non-Veg)",
    "Broccoli Soup",
    "Sweetcorn Soup",
    "Ragi Moringa Soup",
    "Protein Soup",
    "Cold Pressed Juices",
    "Detox Drinks",
    "Desserts (No Refined Sugar)",
    "VRK Diet (with Coconut Oil)",
    "Zero Carb Diet",
    "Satwik Diet",
    "Vegan Diet",
  ],
};

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<ExtendedPlan[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStorefrontPlans()
      .then((data) => {
        if (!cancelled) setPlans(data as ExtendedPlan[]);
      })
      .catch(() => {
        if (!cancelled) setPlans([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const mainPlans = plans?.filter((p) => p.tier !== "Add-on") ?? [];
  const addOns = plans?.filter((p) => p.tier === "Add-on") ?? [];

  return (
    <div className="bg-parchment">

      {/* Hero */}
      <section className="border-b border-cream-border bg-veda-green py-14 text-center text-parchment">
        <p className="text-xs uppercase tracking-[0.3em] text-hitham-gold">
          28-Day Diet Program
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-parchment lg:text-5xl">
          Choose Your Plan
        </h1>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-hitham-gold" />
        <p className="mx-auto mt-5 max-w-xl px-4 text-sm text-parchment/75 leading-relaxed">
          Vedahitham&apos;s 28-day programs are built around Ayurvedic principles —
          clean meals, no chemicals, no refined oils, no sugar.
        </p>
        {/* Contact in hero */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-parchment/80">
          <Link
            href="tel:9573404039"
            className="flex items-center gap-2 hover:text-hitham-gold transition-colors"
          >
            <Phone className="h-4 w-4 text-hitham-gold" />
            9573404039
          </Link>
          <Link
            href="mailto:Vedahitham@gmail.com"
            className="flex items-center gap-2 hover:text-hitham-gold transition-colors"
          >
            <Mail className="h-4 w-4 text-hitham-gold" />
            Vedahitham@gmail.com
          </Link>
        </div>
      </section>

      {/* Plans grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
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
              const hasMeals =
                plan.breakfastPrice || plan.lunchPrice || plan.dinnerPrice;

              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border border-cream-border bg-white overflow-hidden shadow-sm ${style.border}`}
                >
                  <div className="p-5 pb-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                    >
                      {tier}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-veda-green">
                      {plan.title}
                    </h3>
                    {plan.description && (
                      <p className="mt-1 text-xs text-ink-soft">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {hasMeals && (
                    <div className="mx-4 mb-3 rounded-xl bg-parchment-dim p-3">
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-hitham-gold font-semibold">
                        Per meal · Monthly
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {plan.breakfastPrice ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-ink-soft">🌅 Breakfast</span>
                            <span className="font-semibold text-veda-green">
                              {fmt(plan.breakfastPrice)}
                            </span>
                          </div>
                        ) : null}
                        {plan.lunchPrice ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-ink-soft">☀️ Lunch</span>
                            <span className="font-semibold text-veda-green">
                              {fmt(plan.lunchPrice)}
                            </span>
                          </div>
                        ) : null}
                        {plan.dinnerPrice ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-ink-soft">🌙 Dinner</span>
                            <span className="font-semibold text-veda-green">
                              {fmt(plan.dinnerPrice)}
                            </span>
                          </div>
                        ) : null}
                        <div className="mt-1 flex justify-between border-t border-cream-border pt-1.5 text-sm">
                          <span className="font-bold text-veda-green">
                            Combo (28 days)
                          </span>
                          <span className="font-display text-lg font-bold text-veda-green">
                            {fmt(plan.monthlyPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mx-4 mb-3 grid grid-cols-3 divide-x divide-cream-border rounded-xl border border-cream-border text-center">
                    <div className="py-2.5 px-1">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">
                        Weekly
                      </p>
                      <p className="mt-0.5 font-display text-sm font-bold text-veda-green">
                        {fmt(plan.weeklyPrice)}
                      </p>
                    </div>
                    <div className="py-2.5 px-1">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">
                        Monthly
                      </p>
                      <p className="mt-0.5 font-display text-sm font-bold text-veda-green">
                        {fmt(plan.monthlyPrice)}
                      </p>
                    </div>
                    <div className="py-2.5 px-1">
                      <p className="text-[10px] uppercase tracking-wide text-ink-soft">
                        Quarterly
                      </p>
                      <p className="mt-0.5 font-display text-sm font-bold text-veda-green">
                        {fmt(plan.quarterlyPrice)}
                      </p>
                    </div>
                  </div>

                  {plan.benefits.length > 0 && (
                    <div className="mx-4 mb-4">
                      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-hitham-gold font-semibold">
                        Includes
                      </p>
                      <div className="flex flex-col gap-1">
                        {plan.benefits.map((b) => (
                          <div
                            key={b}
                            className="flex items-start gap-2 text-xs text-ink-soft"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-veda-green" />
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto p-4 pt-0">
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

      {/* Full Menu */}
      <section className="bg-parchment-dim py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-wide text-hitham-gold">
              What we serve
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-veda-green lg:text-4xl">
              Our Full Menu
            </h2>
            <div className="mt-2 flex justify-center">
              <div className="h-0.5 w-16 bg-hitham-gold" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Breakfast */}
            <div className="rounded-2xl border border-cream-border bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">🌅</span>
                <h3 className="font-display text-xl font-bold text-veda-green">
                  Breakfast
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {MENU.breakfast.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-hitham-gold shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="rounded-2xl border border-cream-border bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">☀️</span>
                <h3 className="font-display text-xl font-bold text-veda-green">
                  Lunch
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {MENU.lunch.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-hitham-gold shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="rounded-2xl border border-cream-border bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                <h3 className="font-display text-xl font-bold text-veda-green">
                  Dinner
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {MENU.dinner.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-hitham-gold shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <section className="border-t border-cream-border bg-parchment py-12">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <p className="text-xs uppercase tracking-wide text-hitham-gold">
              Enhance your plan
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-veda-green">
              Add-ons
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {addOns.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl border border-cream-border bg-white p-5"
                >
                  <p className="font-display text-lg font-bold text-veda-green">
                    {plan.title}
                  </p>
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

      {/* Contact & Promise */}
      <section className="bg-veda-green py-12 text-center text-parchment">
        <p className="font-display text-xl font-bold text-hitham-gold">
          Ashwini Reddy&apos;s Promise
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {[
            "No junk",
            "No chemicals",
            "No sugar",
            "No refined oils",
            "No compromises",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-hitham-gold/40 px-4 py-1.5 text-xs text-parchment/90"
            >
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-parchment/60">
          Just real food made with care and joy.
        </p>

        {/* Contact details */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="tel:9573404039"
            className="flex items-center gap-2 rounded-full bg-hitham-gold px-5 py-2.5 text-sm font-bold text-veda-green hover:bg-hitham-gold-light transition-colors"
          >
            <Phone className="h-4 w-4" />
            Call: 9573404039
          </Link>
          <Link
            href="mailto:Vedahitham@gmail.com"
            className="flex items-center gap-2 rounded-full border border-hitham-gold px-5 py-2.5 text-sm text-hitham-gold hover:bg-hitham-gold hover:text-veda-green transition-colors"
          >
            <Mail className="h-4 w-4" />
            Vedahitham@gmail.com
          </Link>
          <Link
            href="https://www.instagram.com/hitham_kitchen?igsh=MTNvdWpxMmdsMnRmNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-parchment/30 px-5 py-2.5 text-sm text-parchment hover:bg-parchment/10 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-parchment/70">
          <Clock className="h-4 w-4 text-hitham-gold" />
          <span>Available Mon–Sat, 9 AM – 7 PM</span>
        </div>
      </section>
    </div>
  );
}
