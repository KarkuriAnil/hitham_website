"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badges";
import { updateOrderStatus, updatePaymentStatus } from "@/lib/services/orders";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES: PaymentStatus[] = ["Pending", "Paid", "Failed", "Refunded"];

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
  onUpdated,
}: {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (order: Order) => void;
}) {
  const [saving, setSaving] = useState(false);

  if (!order) return null;

  async function handleOrderStatusChange(status: OrderStatus) {
    if (!order) return;
    setSaving(true);
    try {
      await updateOrderStatus(order.id, status);
      onUpdated({ ...order, orderStatus: status });
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update order status.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePaymentStatusChange(status: PaymentStatus) {
    if (!order) return;
    setSaving(true);
    try {
      await updatePaymentStatus(order.id, status);
      onUpdated({ ...order, paymentStatus: status });
      toast.success(`Payment marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't update payment status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Order #{order.id.slice(0, 8)}</DialogTitle>
          <DialogDescription>
            {order.userName || order.userEmail || "Unknown customer"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-ink-soft">Items</p>
            <div className="flex flex-col gap-2 rounded-lg bg-ivory-dim p-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>
                    {item.title} <span className="text-ink-soft">× {item.quantity}</span>
                  </span>
                  <span>{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between border-t border-border-soft pt-2 text-sm font-medium">
                <span>Total</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-ink-soft">
                Shipping address
              </p>
              <p className="text-sm text-ink">{order.shippingAddress}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Order status</Label>
              <Select
                value={order.orderStatus}
                onValueChange={(v) => handleOrderStatusChange(v as OrderStatus)}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <OrderStatusBadge status={order.orderStatus} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Payment status</Label>
              <Select
                value={order.paymentStatus}
                onValueChange={(v) => handlePaymentStatusChange(v as PaymentStatus)}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
