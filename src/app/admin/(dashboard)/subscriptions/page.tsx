"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/admin/empty-state";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { getSubscriptionPlans, deleteSubscriptionPlan } from "@/lib/services/subscriptionPlans";
import type { SubscriptionPlan } from "@/types";

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(null);

  async function load() {
    try {
      setPlans(await getSubscriptionPlans());
    } catch (err) {
      console.error(err);
      toast.error("Couldn't load subscription plans.");
      setPlans([]);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getSubscriptionPlans()
      .then((data) => {
        if (!cancelled) setPlans(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          toast.error("Couldn't load subscription plans.");
          setPlans([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteSubscriptionPlan(deleteTarget.id);
    setPlans((prev) => prev?.filter((p) => p.id !== deleteTarget.id) ?? null);
    toast.success("Plan deleted");
  }

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Weekly, monthly, and quarterly wellness plans customers can subscribe to."
        action={
          <Button asChild>
            <Link href="/admin/subscriptions/new">
              <Plus className="h-4 w-4" />
              Add plan
            </Link>
          </Button>
        }
      />

      {plans && plans.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="No subscription plans yet"
          description="Create a weekly, monthly, or quarterly plan tied to a health goal or condition."
          actionLabel="Add plan"
          actionHref="/admin/subscriptions/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle>{plan.title}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {plan.diseaseType}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/subscriptions/${plan.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(plan)}>
                    <Trash2 className="h-4 w-4 text-clay" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <p className="text-sm text-ink-soft">{plan.targetGoal}</p>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-ivory-dim p-3 text-center">
                  <div>
                    <p className="text-xs text-ink-soft">Weekly</p>
                    <p className="font-medium text-ink">₹{plan.weeklyPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Monthly</p>
                    <p className="font-medium text-ink">₹{plan.monthlyPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-soft">Quarterly</p>
                    <p className="font-medium text-ink">₹{plan.quarterlyPrice}</p>
                  </div>
                </div>
                <p className="text-xs text-ink-soft">{plan.mealsIncluded} meals included</p>
                {plan.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {plan.benefits.slice(0, 3).map((b) => (
                      <Badge key={b} variant="default">
                        {b}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this plan?"
        description={`"${deleteTarget?.title}" will no longer be available for new subscribers. This can't be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
