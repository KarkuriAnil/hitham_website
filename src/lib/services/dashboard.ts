import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { DashboardStats, Order, Product } from "@/types";

interface TopProduct {
  title: string;
  unitsSold: number;
  revenue: number;
}

interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  topProducts: TopProduct[];
  revenueByMonth: RevenuePoint[];
  recentOrders: Order[];
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export async function getDashboardData(): Promise<DashboardData> {
  const [usersSnap, ordersSnap, productsSnap, subsSnap] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "orders")),
    getDocs(collection(db, "products")),
    getDocs(collection(db, "userSubscriptions")),
  ]);

  const orders: Order[] = ordersSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Order, "id">),
  }));
  const products: Product[] = productsSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Product, "id">),
  }));

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const totalSales = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const now = new Date();
  const monthlyRevenue = paidOrders
    .filter((o) => {
      const created = o.createdAt?.toDate?.();
      return (
        created &&
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeSubscriptions = subsSnap.docs.filter(
    (d) => d.data().status === "Active"
  ).length;

  // Top products by units sold, derived from order line items.
  const productTotals = new Map<string, TopProduct>();
  for (const order of paidOrders) {
    for (const item of order.items || []) {
      const existing = productTotals.get(item.productId) ?? {
        title: item.title,
        unitsSold: 0,
        revenue: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.price * item.quantity;
      productTotals.set(item.productId, existing);
    }
  }
  const topProducts = Array.from(productTotals.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Revenue trend across the last 6 months.
  const months: { key: string; label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: monthLabel(d), revenue: 0 });
  }
  const monthIndex = new Map(months.map((m, idx) => [m.key, idx]));
  for (const order of paidOrders) {
    const created = order.createdAt?.toDate?.();
    if (!created) continue;
    const key = `${created.getFullYear()}-${created.getMonth()}`;
    const idx = monthIndex.get(key);
    if (idx !== undefined) {
      months[idx].revenue += order.totalAmount || 0;
    }
  }

  const recentOrders = [...orders]
    .sort((a, b) => {
      const at = a.createdAt?.toMillis?.() ?? 0;
      const bt = b.createdAt?.toMillis?.() ?? 0;
      return bt - at;
    })
    .slice(0, 8);

  const stats: DashboardStats = {
    totalUsers: usersSnap.size,
    totalSales,
    monthlyRevenue,
    activeSubscriptions,
    totalOrders: orders.length,
    totalProducts: products.length,
  };

  return {
    stats,
    topProducts,
    revenueByMonth: months.map((m) => ({ label: m.label, revenue: m.revenue })),
    recentOrders,
  };
}
