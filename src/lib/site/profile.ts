import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser } from "@/types";

export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<AppUser, "fullName" | "phone" | "age" | "gender" | "weight" | "height" | "diseaseType" | "healthGoal">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), updates);
}
