"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cart from "@/components/ui/cart";
import { useAuthStore } from "@/stores/auth-store";

const CartPage: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return <Cart />;
};

export default CartPage;
