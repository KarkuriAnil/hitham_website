"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badges";
import { EmptyState } from "@/components/admin/empty-state";
import { OrderDetailDialog } from "@/components/admin/orders/order-detail-dialog";
import { getOrders } from "@/lib/services/orders";
import type { Order, OrderStatus } from "@/types";

const STATUS_FILTERS: ("All" | OrderStatus)[] = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(order: Order) {
  const date = order.createdAt?.toDate?.();
  return date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => {
        console.error(err);
        toast.error("Couldn't load orders.");
        setOrders([]);
      });
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.orderStatus === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.userName?.toLowerCase().includes(q) ||
        o.userEmail?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  function handleUpdated(updated: Order) {
    setOrders((prev) => prev?.map((o) => (o.id === updated.id ? updated : o)) ?? null);
    setSelected(updated);
  }

  return (
    <div>
      <PageHeader title="Orders" description="Track and update every order placed on HITHAM." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orders && orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Orders will appear here as soon as customers check out on the storefront."
        />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="cursor-pointer border-b border-border-soft/60 last:border-0 hover:bg-ivory-dim/60"
                >
                  <td className="p-4 font-mono text-xs text-ink-soft">#{order.id.slice(0, 8)}</td>
                  <td className="p-4">{order.userName || order.userEmail || "—"}</td>
                  <td className="p-4 text-ink-soft">{formatDate(order)}</td>
                  <td className="p-4">{formatINR(order.totalAmount)}</td>
                  <td className="p-4">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                </tr>
              ))}
              {orders && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-ink-soft">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      <OrderDetailDialog
        order={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
