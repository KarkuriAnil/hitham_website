import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SubscriptionPlan } from "@/types";

export async function getStorefrontPlans(): Promise<SubscriptionPlan[]> {
  const snap = await getDocs(collection(db, "subscriptionPlans"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SubscriptionPlan, "id">) }));
}

interface CreateSubscriptionInput {
  userId: string;
  planId: string;
  planTitle: string;
  billingCycle: "weekly" | "monthly" | "quarterly";
  amount: number;
  razorpayPaymentId: string;
}

function renewalDateFor(cycle: CreateSubscriptionInput["billingCycle"]): Date {
  const date = new Date();
  if (cycle === "weekly") date.setDate(date.getDate() + 7);
  if (cycle === "monthly") date.setMonth(date.getMonth() + 1);
  if (cycle === "quarterly") date.setMonth(date.getMonth() + 3);
  return date;
}

export async function createUserSubscription(input: CreateSubscriptionInput): Promise<string> {
  const ref = await addDoc(collection(db, "userSubscriptions"), {
    userId: input.userId,
    selectedPlan: input.planId,
    planTitle: input.planTitle,
    billingCycle: input.billingCycle,
    startDate: serverTimestamp(),
    renewalDate: renewalDateFor(input.billingCycle),
    paymentId: input.razorpayPaymentId,
    status: "Active",
  });

  await addDoc(collection(db, "payments"), {
    userId: input.userId,
    razorpayPaymentId: input.razorpayPaymentId,
    amount: input.amount,
    paymentType: input.billingCycle,
    status: "Paid",
    createdAt: serverTimestamp(),
  });

  return ref.id;
}
