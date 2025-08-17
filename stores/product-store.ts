"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";


interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
}

interface ProductState {
  products: Product[] | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[] | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>()(
  devtools(
    persist(
      (set) => ({
        products: null,
        isLoading: false,
        error: null,

        setProducts: (products) => set({ products }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error, isLoading: false }),
        clearError: () => set({ error: null }),
      }),
      {
        name: "product-storage",
        partialize: (state) => ({
          products: state.products,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setLoading(false);
        },
      }
    )
  )
);
