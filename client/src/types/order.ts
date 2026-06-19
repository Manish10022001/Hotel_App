import type { FoodItem } from "./food-item";
import type { Address } from "./user";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderType = "delivery" | "dinein";
export type PaymentMethod = "cod" | "upi" | "card";
export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderItem {
  foodItem: FoodItem;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  type: OrderType;
  address?: Address;
  tableNumber?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  itemsTotal: number;
  deliveryCharge: number;
  packagingCharge: number;
  gstAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  statusHistory: StatusHistoryEntry[];
  estimatedDeliveryTime?: number;
  createdAt: string;
}
