import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-sage-dim bg-sage-dim text-ink",
        success: "border-success-dim bg-success-dim text-success",
        warning: "border-gold/20 bg-gold/10 text-gold",
        destructive: "border-clay-dim bg-clay-dim text-clay",
        outline: "border-border-soft bg-transparent text-ink-soft",
        moss: "border-moss bg-moss text-ivory",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
