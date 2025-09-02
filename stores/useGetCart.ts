"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, CartResponse } from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";

export function useGetCart() {
  const setCart = useCartStore((state) => state.setCart);

  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: apiClient.getCart,
    onSuccess: (data) => {
      setCart(data.cart); // sync Zustand
    },
  });
}
