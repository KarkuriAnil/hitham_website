import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser, Order, UserSubscription } from "@/types";

const COLLECTION = "users";

export async function getUsers(): Promise<AppUser[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AppUser, "id">) }));
}

export async function getUser(id: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<AppUser, "id">) };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
}

export async function getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
  const snap = await getDocs(
    query(collection(db, "userSubscriptions"), where("userId", "==", userId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserSubscription, "id">) }));
}

export async function setUserRole(id: string, role: "admin" | "customer"): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { role });
}
