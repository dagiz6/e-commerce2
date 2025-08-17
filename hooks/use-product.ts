"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/product-store";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

export const useProduct = () => {
  const { setLoading, setError, clearError } = useProductStore();
  const router = useRouter();

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (data: FormData) => apiClient.createProduct(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      toast.success(response.message || "Product created successfully!");
      router.push("/vendor");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message || "Failed to create product");
      setLoading(false);
    },
  });

  // All products query
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await apiClient.getAllProducts();
      return data.products.map((p: any) => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock || 0,
        image: p.images?.[0]?.imageUrl,
        description: p.description,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  // My products query
  const myProductsQuery = useQuery({
    
    queryKey: ["my-products"],
    queryFn: async () => {
      const data = await apiClient.getMyProducts();
      return data.products.map((p: any) => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock || 0,
        image: p.images?.[0]?.imageUrl,
        description: p.description,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  // Single product query
  const useSingleProduct = (id: string) => {
    return useQuery({
      queryKey: ["single-product", id],
      queryFn: async () => {
        const data = await apiClient.singleProduct(id);
        const p = data.product;
        return {
          _id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock || 0,
          image: p.images?.[0]?.imageUrl,
          description: p.description,
        };
      },
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    // Create product mutation
    createProduct: createProductMutation.mutate,
    isCreatingProduct: createProductMutation.isPending,

    // All products
    products: productsQuery.data || [],
    productsError: productsQuery.error as Error | null,
    refetchProducts: productsQuery.refetch,
    productsLoading: productsQuery.isLoading,

    // My products
    myProducts: myProductsQuery.data || [],
    isMyProductsLoading: myProductsQuery.isLoading,
    myProductsError: myProductsQuery.error as Error | null,
    refetchMyProducts: myProductsQuery.refetch,

    // Single product
    useSingleProduct,
  };
};
