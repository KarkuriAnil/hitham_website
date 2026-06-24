import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserSubscription } from "@/types";

export async function getMySubscriptions(userId: string): Promise<UserSubscription[]> {
  const snap = await getDocs(
    query(collection(db, "userSubscriptions"), where("userId", "==", userId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserSubscription, "id">) }));
}
