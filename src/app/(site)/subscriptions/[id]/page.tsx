"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/site/auth/auth-context";
import { getStorefrontPlans, createUserSubscription } from "@/lib/site/subscriptions";
import { openRazorpayCheckout } from "@/lib/site/razorpay-client";
import type { SubscriptionPlan } from "@/types";

type BillingCycle = "weekly" | "monthly" | "quarterly";

const CYCLE_LABEL: Record<BillingCycle, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

export default function SubscriptionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [plan, setPlan] = useState<SubscriptionPlan | null | undefined>(undefined);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    getStorefrontPlans().then((plans) => {
      setPlan(plans.find((p) => p.id === params.id) ?? null);
    });
  }, [params.id]);

  if (plan === undefined) {
    return <div className="mx-auto max-w-3xl px-5 py-16 text-sm text-ink-soft">Loading…</div>;
  }
  if (plan === null) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center text-sm text-ink-soft">
        We couldn&apos;t find that plan.
      </div>
    );
  }

  const priceForCycle: Record<BillingCycle, number> = {
    weekly: plan.weeklyPrice,
    monthly: plan.monthlyPrice,
    quarterly: plan.quarterlyPrice,
  };

  function handleSubscribe() {
    if (!plan) return;
    if (!user) {
      toast.error("Sign in to subscribe.");
      router.push("/login");
      return;
    }

    const currentPlan = plan;
    setSubscribing(true);
    openRazorpayCheckout({
      amount: priceForCycle[cycle],
      name: profile?.fullName || user.displayName || "",
      email: user.email || "",
      description: `${currentPlan.title} — ${CYCLE_LABEL[cycle]}`,
      onSuccess: async (response) => {
        try {
          await createUserSubscription({
            userId: user.uid,
            planId: currentPlan.id,
            planTitle: currentPlan.title,
            billingCycle: cycle,
            amount: priceForCycle[cycle],
            razorpayPaymentId: response.razorpay_payment_id,
          });
          toast.success(`Subscribed to ${currentPlan.title}`);
          router.push("/account/subscriptions");
        } catch (err) {
          console.error(err);
          toast.error("Payment succeeded, but we couldn't activate the subscription. Contact support.");
        } finally {
          setSubscribing(false);
        }
      },
      onFailure: (error) => {
        toast.error(error);
        setSubscribing(false);
      },
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <Badge variant="outline">{plan.diseaseType}</Badge>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink">{plan.title}</h1>
      <p className="mt-2 text-ink-soft">{plan.targetGoal}</p>
      <p className="mt-1 text-sm text-ink-soft">{plan.mealsIncluded} meals included</p>

      {plan.benefits.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          {plan.benefits.map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm text-ink">
              <Check className="h-4 w-4 text-success" />
              {b}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border-soft p-5">
        <p className="mb-3 text-xs uppercase tracking-wide text-ink-soft">Choose billing cycle</p>
        <div className="grid grid-cols-3 gap-3">
          {(["weekly", "monthly", "quarterly"] as BillingCycle[]).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`rounded-lg border p-3 text-center transition-colors ${
                cycle === c ? "border-sage bg-sage-dim" : "border-border-soft hover:border-sage/50"
              }`}
            >
              <p className="text-sm font-medium text-ink">{CYCLE_LABEL[c]}</p>
              <p className="text-xs text-ink-soft">₹{priceForCycle[c].toLocaleString("en-IN")}</p>
            </button>
          ))}
        </div>

        <Button onClick={handleSubscribe} disabled={subscribing} size="lg" className="mt-5 w-full">
          {subscribing
            ? "Processing…"
            : `Subscribe — ₹${priceForCycle[cycle].toLocaleString("en-IN")} / ${cycle.replace("ly", "")}`}
        </Button>
        {!user && (
          <p className="mt-3 text-center text-xs text-ink-soft">
            <Link href="/login" className="text-success hover:underline">
              Sign in
            </Link>{" "}
            first to subscribe.
          </p>
        )}
      </div>
    </div>
  );
}
