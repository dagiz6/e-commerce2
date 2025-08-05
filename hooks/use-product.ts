"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/product-store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export const useProduct = () => {
  const { setLoading, setError, clearError } = useProductStore();
  const router = useRouter();

  const createProductMutation = useMutation({
    mutationFn: (data: FormData) => apiClient.createProduct(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      toast.success(response.message || "Product created successfully!");
      router.push("/vendor"); // Adjust redirect path as needed
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message || "Failed to create product");
      setLoading(false);
    },
  });

  return {
    createProduct: createProductMutation.mutate,
    isCreatingProduct: createProductMutation.isPending,
    isLoading: createProductMutation.isPending,
  };
};
