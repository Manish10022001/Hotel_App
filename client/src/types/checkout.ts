import type { Address } from "./user";
import type { PaymentMethod, OrderType } from "./order";

export interface CheckoutState {
  orderType: OrderType;
  selectedAddress: Address | null;
  paymentMethod: PaymentMethod;
  specialInstructions: string;
  tableNumber: string;
  guestCount: number;
}

export interface PlaceOrderPayload {
  orderType: OrderType;
  address?: Address;
  tableNumber?: string;
  guestCount?: number;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  couponCode?: string;
}
