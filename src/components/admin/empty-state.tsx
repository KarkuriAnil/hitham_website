import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-soft py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-dim">
        <Icon className="h-5 w-5 text-success" />
      </div>
      <div>
        <p className="font-display text-base font-medium text-ink">{title}</p>
        <p className="mt-1 max-w-xs text-sm text-ink-soft">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Button asChild className="mt-2">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
