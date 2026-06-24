import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

const COLLECTION = "orders";

export async function getOrders(): Promise<Order[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
}

export async function getOrder(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Order, "id">) };
}

export async function updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { orderStatus });
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { paymentStatus });
}

export async function cancelOrder(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { orderStatus: "Cancelled" satisfies OrderStatus });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
