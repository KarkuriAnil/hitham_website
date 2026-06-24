"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/admin/tag-input";
import {
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "@/lib/services/subscriptionPlans";
import type { SubscriptionPlan } from "@/types";

const DISEASE_TYPES = [
  "All",
  "Diabetes",
  "PCOS",
  "Weight Loss",
  "Weight Gain",
  "Gut Health",
  "Detox",
  "Cholesterol",
  "Healthy Lifestyle",
] as const;

const planSchema = z.object({
  title: z.string().min(2, "Title is required"),
  weeklyPrice: z.coerce.number().positive("Weekly price must be greater than 0"),
  monthlyPrice: z.coerce.number().positive("Monthly price must be greater than 0"),
  quarterlyPrice: z.coerce.number().positive("Quarterly price must be greater than 0"),
  mealsIncluded: z.coerce.number().int().positive("Meals included must be at least 1"),
  diseaseType: z.enum(DISEASE_TYPES),
  targetGoal: z.string().min(2, "Target goal is required"),
  benefits: z.array(z.string()),
});

type PlanFormInput = z.input<typeof planSchema>;
type PlanFormValues = z.output<typeof planSchema>;

export function SubscriptionPlanForm({ plan }: { plan?: SubscriptionPlan }) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormInput, unknown, PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: plan
      ? {
          title: plan.title,
          weeklyPrice: plan.weeklyPrice,
          monthlyPrice: plan.monthlyPrice,
          quarterlyPrice: plan.quarterlyPrice,
          mealsIncluded: plan.mealsIncluded,
          diseaseType: plan.diseaseType as PlanFormValues["diseaseType"],
          targetGoal: plan.targetGoal,
          benefits: plan.benefits,
        }
      : {
          title: "",
          weeklyPrice: 0,
          monthlyPrice: 0,
          quarterlyPrice: 0,
          mealsIncluded: 7,
          diseaseType: "All",
          targetGoal: "",
          benefits: [],
        },
  });

  async function onSubmit(values: PlanFormValues) {
    try {
      if (plan) {
        await updateSubscriptionPlan(plan.id, values);
        toast.success("Plan updated");
      } else {
        await createSubscriptionPlan(values);
        toast.success("Plan created");
      }
      router.push("/admin/subscriptions");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save the plan. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Plan name</Label>
        <Input id="title" placeholder="e.g. Gut Reset Weekly" {...register("title")} />
        {errors.title && <p className="text-xs text-clay">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="weeklyPrice">Weekly price (₹)</Label>
          <Input id="weeklyPrice" type="number" step="0.01" {...register("weeklyPrice")} />
          {errors.weeklyPrice && (
            <p className="text-xs text-clay">{errors.weeklyPrice.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="monthlyPrice">Monthly price (₹)</Label>
          <Input id="monthlyPrice" type="number" step="0.01" {...register("monthlyPrice")} />
          {errors.monthlyPrice && (
            <p className="text-xs text-clay">{errors.monthlyPrice.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="quarterlyPrice">Quarterly price (₹)</Label>
          <Input id="quarterlyPrice" type="number" step="0.01" {...register("quarterlyPrice")} />
          {errors.quarterlyPrice && (
            <p className="text-xs text-clay">{errors.quarterlyPrice.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="mealsIncluded">Meals included</Label>
          <Input id="mealsIncluded" type="number" {...register("mealsIncluded")} />
          {errors.mealsIncluded && (
            <p className="text-xs text-clay">{errors.mealsIncluded.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="diseaseType">Disease focus</Label>
          <select
            id="diseaseType"
            {...register("diseaseType")}
            className="h-10 rounded-md border border-border-soft bg-white px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            {DISEASE_TYPES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="targetGoal">Target goal</Label>
          <Input id="targetGoal" placeholder="e.g. Sustainable weight loss" {...register("targetGoal")} />
          {errors.targetGoal && (
            <p className="text-xs text-clay">{errors.targetGoal.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Benefits</Label>
        <Controller
          control={control}
          name="benefits"
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Type a benefit, press Enter"
            />
          )}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : plan ? "Save changes" : "Create plan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/subscriptions")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
