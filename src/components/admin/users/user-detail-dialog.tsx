"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OrderStatusBadge, SubscriptionStatusBadge } from "@/components/admin/status-badges";
import { getUserOrders, getUserSubscriptions } from "@/lib/services/users";
import type { AppUser, Order, UserSubscription } from "@/types";

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: AppUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subs, setSubs] = useState<UserSubscription[]>([]);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);

  const loading = !!user && loadedForUserId !== (user.uid || user.id);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const targetId = user.uid || user.id;
    Promise.all([getUserOrders(targetId), getUserSubscriptions(targetId)])
      .then(([o, s]) => {
        if (cancelled) return;
        setOrders(o);
        setSubs(s);
        setLoadedForUserId(targetId);
      })
      .catch(() => {
        if (!cancelled) setLoadedForUserId(targetId);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{user.fullName || "Unnamed customer"}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-ivory-dim p-3 text-sm sm:grid-cols-3">
            <Info label="Phone" value={user.phone || "—"} />
            <Info label="Age" value={user.age ? String(user.age) : "—"} />
            <Info label="Gender" value={user.gender || "—"} />
            <Info label="Weight" value={user.weight ? `${user.weight} kg` : "—"} />
            <Info label="Height" value={user.height ? `${user.height} cm` : "—"} />
            <Info label="Goal" value={user.healthGoal || "—"} />
            <Info label="Condition" value={user.diseaseType || "—"} />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">Subscriptions</p>
            {loading && <p className="text-sm text-ink-soft">Loading…</p>}
            {!loading && subs.length === 0 && (
              <p className="text-sm text-ink-soft">No subscriptions yet.</p>
            )}
            <div className="flex flex-col gap-2">
              {subs.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border-soft p-2.5 text-sm"
                >
                  <span>{s.planTitle || s.selectedPlan}</span>
                  <SubscriptionStatusBadge status={s.status} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">Purchase history</p>
            {!loading && orders.length === 0 && (
              <p className="text-sm text-ink-soft">No orders yet.</p>
            )}
            <div className="flex flex-col gap-2">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-lg border border-border-soft p-2.5 text-sm"
                >
                  <span className="font-mono text-xs text-ink-soft">#{o.id.slice(0, 8)}</span>
                  <span>{formatINR(o.totalAmount)}</span>
                  <OrderStatusBadge status={o.orderStatus} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
