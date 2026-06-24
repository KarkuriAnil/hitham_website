import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SubscriptionPlan, SubscriptionPlanInput } from "@/types";

const COLLECTION = "subscriptionPlans";

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SubscriptionPlan, "id">) }));
}

export async function getSubscriptionPlan(id: string): Promise<SubscriptionPlan | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<SubscriptionPlan, "id">) };
}

export async function createSubscriptionPlan(input: SubscriptionPlanInput): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSubscriptionPlan(
  id: string,
  input: Partial<SubscriptionPlanInput>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...input });
}

export async function deleteSubscriptionPlan(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
