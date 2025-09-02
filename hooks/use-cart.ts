"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

// Main hook for cart
export const useCart = () => {
  const queryClient = useQueryClient();
  const { setCart, setLoading, setError, clearError } = useCartStore();

  //  Fetch my cart
  const myCartQuery = useQuery({
    queryKey: ["my-cart"],
    queryFn: async () => {
      setLoading(true);
      clearError();
      try {
        const data = await apiClient.getMyCart();
        setCart(data.cart.products); // sync Zustand store
        return data.cart;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 2,
  });

  //  Add to cart
  const addToCartMutation = useMutation({
    mutationFn: (products: { productId: string; quantity: number }[]) =>
      apiClient.addToCart(products),
    onSuccess: (res) => {
      toast.success(res.message || "Added to cart!");
      queryClient.invalidateQueries({ queryKey: ["my-cart"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add to cart");
    },
  });

  // Update cart
  const updateCartMutation = useMutation({
    mutationFn: (products: { productId: string; quantity: number }[]) =>
      apiClient.updateCart(products),
    onSuccess: (res) => {
      toast.success(res.message || "Cart updated!");
      queryClient.invalidateQueries({ queryKey: ["my-cart"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update cart");
    },
  });

  return {
    // Cart data
    myCart: myCartQuery.data,
    isMyCartLoading: myCartQuery.isLoading,
    myCartError: myCartQuery.error as Error | null,
    refetchMyCart: myCartQuery.refetch,

    // Zustand cart
    cart: useCartStore((state) => state.cart),

    // Mutations
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,

    updateCart: updateCartMutation.mutate,
    isUpdatingCart: updateCartMutation.isPending,
  };
};

// Optional small wrapper for addToCart only
export const useAddToCart = () => {
  const { addToCart, isAddingToCart } = useCart();
  return { addToCart, isAddingToCart };
};
