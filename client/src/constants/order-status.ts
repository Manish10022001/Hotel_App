import { COLORS } from "./colors";
import type { OrderStatus } from "../types/order";

interface StatusConfig {
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Order Placed",
    description: "We have received your order",
    icon: "receipt",
    color: "#F57F17",
    bgColor: "#FFFDE7",
  },
  confirmed: {
    label: "Order Confirmed",
    description: "Restaurant has confirmed your order",
    icon: "check-circle",
    color: "#1565C0",
    bgColor: "#E3F2FD",
  },
  preparing: {
    label: "Being Prepared",
    description: "Our chef is cooking your food",
    icon: "restaurant",
    color: "#E65100",
    bgColor: "#FFF3E0",
  },
  ready: {
    label: "Ready",
    description: "Your order is packed and ready",
    icon: "inventory",
    color: "#6A1B9A",
    bgColor: "#F3E5F5",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    description: "Your order is on the way",
    icon: "delivery-dining",
    color: COLORS.primary,
    bgColor: COLORS.primaryLight,
  },
  delivered: {
    label: "Delivered",
    description: "Enjoy your meal!",
    icon: "celebration",
    color: COLORS.primary,
    bgColor: COLORS.primaryLight,
  },
  cancelled: {
    label: "Cancelled",
    description: "Your order has been cancelled",
    icon: "cancel",
    color: "#C62828",
    bgColor: "#FFEBEE",
  },
};

export const DELIVERY_STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export const DINEIN_STATUS_STEPS: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
];
