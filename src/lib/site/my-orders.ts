import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/types";

export async function getMyOrders(userId: string): Promise<Order[]> {
  const snap = await getDocs(query(collection(db, "orders"), where("userId", "==", userId)));
  const orders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
  return orders.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}
