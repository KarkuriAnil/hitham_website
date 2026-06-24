"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, IndianRupee, CalendarRange, Package, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/admin/layout/page-header";
import { StatCard } from "@/components/admin/dashboard/stat-card";
import { RevenueChart } from "@/components/admin/dashboard/revenue-chart";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData, type DashboardData } from "@/lib/services/dashboard";

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Couldn't load dashboard data. Check your Firebase connection.");
      });
  }, []);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="A calm look at how HITHAM is growing this month."
      />

      {error && (
        <Card className="mb-6 border-clay-dim bg-clay-dim/40 p-4">
          <p className="text-sm text-clay">{error}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={data ? data.stats.totalUsers.toLocaleString("en-IN") : "—"}
          icon={Users}
          accent="sage"
        />
        <StatCard
          label="Total sales"
          value={data ? formatINR(data.stats.totalSales) : "—"}
          icon={IndianRupee}
          accent="gold"
        />
        <StatCard
          label="This month's revenue"
          value={data ? formatINR(data.stats.monthlyRevenue) : "—"}
          icon={ArrowUpRight}
          accent="sage"
        />
        <StatCard
          label="Active subscriptions"
          value={data ? data.stats.activeSubscriptions.toLocaleString("en-IN") : "—"}
          icon={CalendarRange}
          accent="clay"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue, last 6 months</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <RevenueChart data={data.revenueByMonth} />
            ) : (
              <div className="flex h-[260px] items-center justify-center text-sm text-ink-soft">
                Loading…
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top products</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data && data.topProducts.length === 0 && (
              <p className="text-sm text-ink-soft">No sales recorded yet.</p>
            )}
            {data?.topProducts.map((p, i) => (
              <div key={p.title} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sage-dim text-xs font-medium text-success">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{p.title}</p>
                    <p className="text-xs text-ink-soft">{p.unitsSold} sold</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-ink">{formatINR(p.revenue)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent orders</CardTitle>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-success hover:underline"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="pb-2 font-medium">Order</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Payment</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border-soft/60 last:border-0">
                  <td className="py-2.5 font-mono text-xs text-ink-soft">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-2.5">{order.userName || order.userEmail || "—"}</td>
                  <td className="py-2.5">{formatINR(order.totalAmount)}</td>
                  <td className="py-2.5">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="py-2.5">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                </tr>
              ))}
              {data && data.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-soft">
                    No orders yet. They&apos;ll show up here as customers check out.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
