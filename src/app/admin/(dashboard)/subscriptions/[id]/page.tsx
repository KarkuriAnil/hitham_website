"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/layout/page-header";
import { SubscriptionPlanForm } from "@/components/admin/subscriptions/subscription-plan-form";
import { getSubscriptionPlan } from "@/lib/services/subscriptionPlans";
import type { SubscriptionPlan } from "@/types";

export default function EditSubscriptionPlanPage() {
  const params = useParams<{ id: string }>();
  const [plan, setPlan] = useState<SubscriptionPlan | null | undefined>(undefined);

  useEffect(() => {
    getSubscriptionPlan(params.id).then(setPlan);
  }, [params.id]);

  if (plan === undefined) return <p className="text-sm text-ink-soft">Loading…</p>;
  if (plan === null) return <p className="text-sm text-clay">Plan not found.</p>;

  return (
    <div>
      <PageHeader title="Edit plan" description={plan.title} />
      <SubscriptionPlanForm plan={plan} />
    </div>
  );
}
