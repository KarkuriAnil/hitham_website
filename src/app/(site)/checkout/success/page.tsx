import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-dim">
        <CheckCircle2 className="h-7 w-7 text-success" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-medium text-ink">
        Your order is confirmed
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        We&apos;ve sent the details to your account. You can track it anytime from your orders page.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline">
          <Link href="/products">Keep shopping</Link>
        </Button>
        <Button asChild>
          <Link href="/account/orders">View my orders</Link>
        </Button>
      </div>
    </div>
  );
}
