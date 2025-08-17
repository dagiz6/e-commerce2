"use client";

import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";


interface AuthStore {
  isAuthenticated: boolean;
  user: {
    role: string;
  } | null;
  isLoading: boolean;
}

export default function ManageProduct() {
  const router = useRouter();
  const { myProducts, isMyProductsLoading, myProductsError } = useProduct();
    const { isAuthenticated, user, isLoading } = useAuthStore() as AuthStore;


  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) return router.push("/auth/sign-in");
      if (user?.role !== "vendor") {
        router.push(user?.role === "admin" ? "/admin" : "/dashboard");
      }
    }
      }, [ isAuthenticated, user, router]);


  if (isMyProductsLoading)
    return (
      <p className="text-center text-green-600 mt-8">Loading your products...</p>
    );

  if (myProductsError)
    return (
              <div className="text-center text-gray-700 space-y-4">
          <p className="text-lg font-medium">
            You have no products listed yet.
          </p>
          <Button
            onClick={() => router.push("/vendor")}
            className="inline-flex items-center gap-2 justify-center mx-auto bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-100 p-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/vendor")}
      >
        ← Back to Vendor Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Products</h1>

      {myProducts.length === 0 ? (
        <div className="text-center text-gray-700 space-y-4">
          <p className="text-lg font-medium">
            You have no products listed yet.
          </p>
          <Button
            onClick={() => router.push("/vendor")}
            className="inline-flex items-center gap-2 justify-center mx-auto bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map((p) => (
            <div
              key={p._id}
              onClick={() => router.push(`/vendor/manageProduct/${p._id}`)}
              className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:scale-[1.03] transition-transform p-4 cursor-pointer"
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md text-gray-400 mb-4">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {p.name}
              </h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Price:</span> {p.price} ETB
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Category:</span> {p.category}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Stock:</span> {p.stock}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Description</span> {p.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
