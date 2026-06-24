import type { Timestamp } from "firebase/firestore";

export type DiseaseType =
  | "Diabetes"
  | "PCOS"
  | "Weight Loss"
  | "Weight Gain"
  | "Gut Health"
  | "Detox"
  | "Cholesterol"
  | "Healthy Lifestyle";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";
export type SubscriptionStatus = "Active" | "Paused" | "Cancelled" | "Expired";
export type UserRole = "admin" | "customer";

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  stockQuantity: number;
  ingredients: string[];
  nutritionInfo: NutritionInfo;
  benefits: string[];
  rating: number;
  createdAt: Timestamp | null;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "rating"> & {
  rating?: number;
};

export interface SubscriptionPlan {
  id: string;
  title: string;
  weeklyPrice: number;
  monthlyPrice: number;
  quarterlyPrice: number;
  mealsIncluded: number;
  diseaseType: DiseaseType | "All";
  targetGoal: string;
  benefits: string[];
  imageUrl?: string;
  createdAt: Timestamp | null;
}

export type SubscriptionPlanInput = Omit<SubscriptionPlan, "id" | "createdAt">;

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress?: string;
  createdAt: Timestamp | null;
}

export interface AppUser {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  diseaseType?: DiseaseType;
  healthGoal?: string;
  activeSubscription: boolean;
  role: UserRole;
  createdAt: Timestamp | null;
}

export interface UserSubscription {
  id: string;
  userId: string;
  selectedPlan: string;
  planTitle?: string;
  billingCycle: "weekly" | "monthly" | "quarterly";
  startDate: Timestamp | null;
  renewalDate: Timestamp | null;
  paymentId?: string;
  status: SubscriptionStatus;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: Timestamp | null;
}

export type BlogInput = Omit<Blog, "id" | "createdAt">;

export interface Testimonial {
  id: string;
  userName: string;
  message: string;
  rating: number;
  image?: string;
  createdAt: Timestamp | null;
}

export type TestimonialInput = Omit<Testimonial, "id" | "createdAt">;

export interface Payment {
  id: string;
  userId: string;
  razorpayPaymentId: string;
  amount: number;
  paymentType: "product" | "weekly" | "monthly" | "quarterly";
  status: PaymentStatus;
  createdAt: Timestamp | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalSales: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalOrders: number;
  totalProducts: number;
}
