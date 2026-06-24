import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus, SubscriptionStatus } from "@/types";

const ORDER_VARIANT: Record<OrderStatus, "default" | "success" | "warning" | "destructive"> = {
  Pending: "warning",
  Processing: "default",
  Shipped: "default",
  Delivered: "success",
  Cancelled: "destructive",
};

const PAYMENT_VARIANT: Record<PaymentStatus, "default" | "success" | "warning" | "destructive"> = {
  Pending: "warning",
  Paid: "success",
  Failed: "destructive",
  Refunded: "default",
};

const SUB_VARIANT: Record<SubscriptionStatus, "default" | "success" | "warning" | "destructive"> = {
  Active: "success",
  Paused: "warning",
  Cancelled: "destructive",
  Expired: "default",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={ORDER_VARIANT[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_VARIANT[status]}>{status}</Badge>;
}

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return <Badge variant={SUB_VARIANT[status]}>{status}</Badge>;
}
