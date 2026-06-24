"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStorefrontPlans } from "@/lib/site/subscriptions";
import type { SubscriptionPlan } from "@/types";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStorefrontPlans()
      .then((data) => {
        if (!cancelled) setPlans(data);
      })
      .catch(() => {
        if (!cancelled) setPlans([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-ink-soft">Plans</p>
        <h1 className="growth-line mt-1 inline font-display text-3xl font-medium text-ink">
          Subscribe to a routine
        </h1>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Weekly, monthly, or quarterly meal plans built around a goal — not just a calendar.
        </p>
      </div>

      {plans === null ? (
        <p className="text-sm text-ink-soft">Loading plans…</p>
      ) : plans.length === 0 ? (
        <p className="text-sm text-ink-soft">No plans available right now — check back soon.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <Badge variant="outline" className="mb-2 w-fit">
                  {plan.diseaseType}
                </Badge>
                <CardTitle>{plan.title}</CardTitle>
                <p className="text-sm text-ink-soft">{plan.targetGoal}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="font-display text-2xl font-medium text-ink">
                  ₹{plan.weeklyPrice.toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-ink-soft"> / week</span>
                </p>
                {plan.benefits.length > 0 && (
                  <ul className="flex flex-col gap-1.5 text-sm text-ink-soft">
                    {plan.benefits.slice(0, 3).map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                )}
                <Button asChild className="mt-auto">
                  <Link href={`/subscriptions/${plan.id}`}>View plan</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
