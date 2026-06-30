import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { FoodItem } from "../types/food-item";
import { MAX_CART_ITEMS } from "../constants/app";
import { haptics } from '@utils/haptics';

interface CartItem {
  item: FoodItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: FoodItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  getItemCount: () => number;
  getItemsTotal: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (i) => i.item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { items: updated };
      }
      if (state.items.length >= MAX_CART_ITEMS) return state;
      return { items: [...state.items, { item: action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.item.id !== action.payload) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.item.id !== action.payload.itemId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.item.id === action.payload.itemId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = (item: FoodItem) => {
    haptics.light();
    dispatch({ type: "ADD_ITEM", payload: item });
  };
  const removeFromCart = (itemId: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  const updateQuantity = (itemId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const getItemQuantity = (itemId: string) =>
    state.items.find((i) => i.item.id === itemId)?.quantity ?? 0;
  const getItemCount = () =>
    state.items.reduce((sum, i) => sum + i.quantity, 0);
  const getItemsTotal = () =>
    state.items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        getItemCount,
        getItemsTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
