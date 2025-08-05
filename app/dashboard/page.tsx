"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  ShoppingBag,
  LogOut,
  Filter,
  ShoppingCart,
  Search,
  Menu,
} from "lucide-react";
import { useProduct } from "@/hooks/use-product";

// Define the Product interface
interface Product {
  _id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

// Define the AuthStore interface
interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string; role: string } | null;
  logout: () => void;
  cart: Product[] | undefined;
  setCart: (cart: Product[] | undefined) => void;
}

export default function DashboardPage() {
  const { isAuthenticated, user, isLoading, logout, cart, setCart } =
    useAuthStore() as AuthStore;
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Use the useProduct hook
  const { 
    products, 
    productsLoading, 
    productsError,
    refetchProducts 
  } = useProduct();

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

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    logout();
    router.push("/auth/sign-in");
  };

  const handleAddToCart = (product: Product) => {
    if (cart) {
      setCart([...cart, product]);
    } else {
      setCart([product]);
    }
  };

  const categories: string[] = [
    "All",
    "Electronics",
    "Fashion",
    "Home",
    "Accessories",
  ];

  // Filter products based on selected category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Check if a product is in the cart
  const isProductInCart = (productId: number): boolean => {
    return cart ? cart.some((item) => item._id === productId) : false;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                className="sm:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                  {cart && cart.length > 0 && (
                    <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {cart.length}
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
        <div className="flex flex-col sm:flex-row">
          {/* Categories Sidebar */}
          <aside
            className={`w-full sm:w-64 sm:mr-8 ${
              isSidebarOpen ? "block" : "hidden sm:block"
            }`}
          >
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Categories
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Browse by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsSidebarOpen(false); // Close sidebar on mobile
                      }}
                      className={`w-full text-left px-4 py-2 rounded-md text-sm sm:text-base ${
                        selectedCategory === category
                          ? "bg-purple-100 text-purple-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 mt-6 sm:mt-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                Welcome back, {user.name}!
              </h2>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base text-gray-700 w-full sm:w-auto"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {productsLoading ? (
                <p className="text-gray-600 col-span-full text-center text-sm sm:text-base">
                  Loading products...
                </p>
              ) : productsError ? (
                <div className="col-span-full text-center">
                  <p className="text-red-600 text-sm sm:text-base">
                    Error loading products: {productsError.message}
                  </p>
                  <Button
                    onClick={() => refetchProducts()}
                    variant="outline"
                    className="mt-2"
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-gray-600 col-span-full text-center text-sm sm:text-base">
                  No products found.
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    className="border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="w-full h-48 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {product.category}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                          Stock:{" "}
                          <span className="font-medium text-gray-800">
                            {product.stock}
                          </span>
                        </p>

                        <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1 sm:mt-2">
                          {product.price.toFixed(2)} ETB
                        </p>
                        <Button
                          className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm py-1 sm:py-2"
                          onClick={() => handleAddToCart(product)}
                          disabled={isProductInCart(product._id)}
                        >
                          {isProductInCart(product._id) ? "Added" : "Add to Cart"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
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