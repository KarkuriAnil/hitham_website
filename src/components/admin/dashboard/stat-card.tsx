import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "sage",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "sage" | "gold" | "clay";
}) {
  const accentClasses = {
    sage: "bg-sage-dim text-success",
    gold: "bg-gold/10 text-gold",
    clay: "bg-clay-dim text-clay",
  }[accent];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
          <p className="mt-2 font-display text-2xl font-medium text-ink">{value}</p>
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", accentClasses)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <div className="mt-4 h-px w-full scale-x-0 bg-sage transition-transform duration-500 group-hover:scale-x-100" />
    </Card>
  );
}
