"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cart from "@/components/ui/cart"; // Adjust path to your Cart component
import { useAuthStore } from "@/stores/auth-store";

// Define the Product interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

// Define the AuthStore interface
interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string; role: string } | null;
  logout: () => void;
  cart: Product[] | undefined;
  setCart: React.Dispatch<React.SetStateAction<Product[] | undefined>>;
}

// Define the CartPage component
const CartPage: React.FC = () => {
  const { isAuthenticated, isLoading, user, cart, setCart } =
    useAuthStore() as AuthStore;
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

  if (!isAuthenticated || !user) {
    return null;
  }

  return <Cart cart={cart || []} setCart={setCart} />;
};

export default CartPage;
