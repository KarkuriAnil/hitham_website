"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/site/account/require-auth";
import { useAuth } from "@/components/site/auth/auth-context";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badges";
import { Card } from "@/components/ui/card";
import { getMyOrders } from "@/lib/site/my-orders";
import type { Order } from "@/types";

function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyOrders(user.uid).then(setOrders);
  }, [user]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="growth-line mb-8 inline font-display text-3xl font-medium text-ink">
        My orders
      </h1>

      {orders === null ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-ink-soft">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-ink-soft">#{order.id.slice(0, 8)}</p>
                <div className="flex gap-2">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {order.items?.map((item, i) => (
                  <p key={i} className="text-sm text-ink-soft">
                    {item.title} × {item.quantity}
                  </p>
                ))}
              </div>
              <p className="mt-3 font-medium text-ink">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AccountOrdersPage() {
  return (
    <RequireAuth>
      <OrdersContent />
    </RequireAuth>
  );
}
