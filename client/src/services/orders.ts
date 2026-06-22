import { Order } from "../types/order";
import type { PlaceOrderPayload } from "../types/checkout";
import { MOCK_ORDERS, MOCK_USER } from "./mock-data";
import {
  DELIVERY_CHARGE,
  FREE_DELIVERY_THRESHOLD,
  PACKAGING_CHARGE,
  GST_PERCENTAGE,
} from "@constants/app";

function simulateDelay(ms = 1200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(1000 + Math.random() * 9000));
  return `MH-${year}-${num}`;
}

export const orderService = {
  placeOrder: async (
    cartItems: {
      item: { id: string; name: string; image?: string; price: number };
      quantity: number;
    }[],
    payload: PlaceOrderPayload
  ): Promise<Order> => {
    await simulateDelay();

    const itemsTotal = cartItems.reduce(
      (sum, ci) => sum + ci.item.price * ci.quantity,
      0
    );
    const deliveryCharge =
      payload.orderType === "delivery" && itemsTotal < FREE_DELIVERY_THRESHOLD
        ? DELIVERY_CHARGE
        : 0;
    const packagingCharge = PACKAGING_CHARGE;
    const gstAmount = Math.round(
      ((itemsTotal + packagingCharge) * GST_PERCENTAGE) / 100
    );
    const totalAmount =
      itemsTotal + deliveryCharge + packagingCharge + gstAmount;

    const order: Order = {
      id: "o_" + Date.now(),
      orderNumber: generateOrderNumber(),
      items: cartItems.map((ci) => ({
        foodItem: ci.item as never,
        name: ci.item.name,
        image: ci.item.image,
        price: ci.item.price,
        quantity: ci.quantity,
        subtotal: ci.item.price * ci.quantity,
      })),
      type: payload.orderType,
      address: payload.address,
      tableNumber: payload.tableNumber,
      status: "pending",
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === "cod" ? "pending" : "paid",
      itemsTotal,
      deliveryCharge,
      packagingCharge,
      gstAmount,
      totalAmount,
      specialInstructions: payload.specialInstructions,
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date().toISOString(),
          note: "Order placed successfully",
        },
      ],
      estimatedDeliveryTime: payload.orderType === "delivery" ? 35 : 20,
      createdAt: new Date().toISOString(),
    };

    return order;
  },

  getOrders: async (): Promise<Order[]> => {
    await simulateDelay(800);
    return MOCK_ORDERS;
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    await simulateDelay(600);
    return MOCK_ORDERS.find((o) => o.id === orderId) ?? null;
  },
};
