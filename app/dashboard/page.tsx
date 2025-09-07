"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import { useProduct } from "@/hooks/use-product";
import { useCart } from "@/hooks/use-cart";
import { useAuthStore } from "@/stores/auth-store";

// Product interface
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

// AuthStore interface
interface AuthStore {
  user: { name: string; email: string; role: string } | null;
}

export default function DashboardPage() {
  const { user } = useAuthStore() as AuthStore;
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Products
  const { products, productsLoading, productsError, refetchProducts } =
    useProduct();

  // Cart hook
  const { cart, addToCart } = useCart();

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    if (!cart?.some((item) => item.productId === product._id)) {
      addToCart([{ productId: product._id, quantity: 1 }]);
    }
  };

  const categories: string[] = [
    "All",
    "Electronics",
    "Fashion",
    "Home",
    "Accessories",
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 sm:mr-8">
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
                  onClick={() => setSelectedCategory(category)}
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h2>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600 hidden sm:block" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
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
                onClick={() => router.push(`/dashboard/${product._id}`)}
                className="border-0 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents navigating
                        handleAddToCart(product);
                      }}
                      disabled={cart?.some(
                        (item) => item.productId === product._id
                      )}
                    >
                      {cart?.some((item) => item.productId === product._id)
                        ? "Added"
                        : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
