"use client";

import { create } from "zustand";

// Define cart item shape
interface CartItem {
  productId: string;
  quantity: number;
  _id?: string;
}

interface CartState {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;

  setCart: (cart: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isLoading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  addItem: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
  updateItem: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    })),
  removeItem: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    })),
  clearCart: () => set({ cart: [] }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
