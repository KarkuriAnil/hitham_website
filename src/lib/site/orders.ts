import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CartItem } from "@/lib/site/cart-types";

interface CreateOrderInput {
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

export async function createOrderRecord(input: CreateOrderInput): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), {
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    items: input.items.map((i) => ({
      productId: i.productId,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
    totalAmount: input.totalAmount,
    paymentStatus: "Paid",
    orderStatus: "Pending",
    shippingAddress: input.shippingAddress,
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, "payments"), {
    userId: input.userId,
    razorpayPaymentId: input.razorpayPaymentId,
    amount: input.totalAmount,
    paymentType: "product",
    status: "Paid",
    createdAt: serverTimestamp(),
  });

  return ref.id;
}
