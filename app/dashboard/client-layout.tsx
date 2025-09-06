"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store"; // <-- use cart store
import { Button } from "@/components/ui/button";
import {
  User,
  ShoppingBag,
  LogOut,
  ShoppingCart,
  Search,
  Menu,
} from "lucide-react";


// Define the AuthStore interface
interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string; role: string } | null;
  logout: () => void;
}

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading, logout } =
    useAuthStore() as AuthStore;
  const cart = useCartStore((state) => state.cart); // <-- reactive cart
  const router = useRouter();
  const fetchCart = useCartStore((state) => state.fetchCart);


  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/sign-in");
      } else if (user?.role !== "user") {
        if (user?.role === "admin") {
          router.push("/admin");
        } else if (user?.role === "vendor") {
          router.push("/vendor");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "user") {
      fetchCart(); //  refresh from backend when dashboard loads
    }
  }, [isLoading, isAuthenticated, user, fetchCart]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    logout();
    router.push("/auth/sign-in");
  };

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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                className="sm:hidden"
                onClick={() => {} /* Sidebar toggle logic */}
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
                ShopHub
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative w-24 sm:w-40 md:w-48">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs h-8 sm:h-9"
                  onClick={() => router.push("/dashboard/cart")}
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.name}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs h-8 sm:h-9"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ShopHub</h3>
              <p className="text-sm text-gray-600 mt-2">
                Your one-stop shop for electronics, fashion, home goods, and
                more.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a
                    href="/about"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <p className="text-sm text-gray-600 mt-2">
                Email: support@shophub.com
                <br />
                Phone: +251993941832
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
