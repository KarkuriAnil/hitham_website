"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireAuth } from "@/components/site/account/require-auth";
import { useAuth } from "@/components/site/auth/auth-context";
import { SubscriptionStatusBadge } from "@/components/admin/status-badges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMySubscriptions } from "@/lib/site/my-subscriptions";
import type { UserSubscription } from "@/types";

function SubscriptionsContent() {
  const { user } = useAuth();
  const [subs, setSubs] = useState<UserSubscription[] | null>(null);

  useEffect(() => {
    if (!user) return;
    getMySubscriptions(user.uid).then(setSubs);
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="growth-line mb-8 inline font-display text-3xl font-medium text-ink">
        My subscriptions
      </h1>

      {subs === null ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : subs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-soft py-12 text-center">
          <p className="text-sm text-ink-soft">No active subscriptions yet.</p>
          <Button asChild className="mt-4">
            <Link href="/subscriptions">Browse plans</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {subs.map((sub) => (
            <Card key={sub.id} className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium text-ink">{sub.planTitle || sub.selectedPlan}</p>
                <p className="text-sm text-ink-soft capitalize">{sub.billingCycle} billing</p>
              </div>
              <SubscriptionStatusBadge status={sub.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountSubscriptionsPage() {
  return (
    <RequireAuth>
      <SubscriptionsContent />
    </RequireAuth>
  );
}
