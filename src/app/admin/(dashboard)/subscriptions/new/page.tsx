import { PageHeader } from "@/components/admin/layout/page-header";
import { SubscriptionPlanForm } from "@/components/admin/subscriptions/subscription-plan-form";

export default function NewSubscriptionPlanPage() {
  return (
    <div>
      <PageHeader title="Add subscription plan" description="Create a new wellness plan." />
      <SubscriptionPlanForm />
    </div>
  );
}
