"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function Cart() {
  const router = useRouter();
  const { cart: storeCart, updateCart } = useCart();
  const [localCart, setLocalCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product details from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          storeCart.map(async (item) => {
            const data = await apiClient.singleProduct(item.productId);
            return {
              _id: item.productId,
              name: data.product.name,
              price: data.product.price,
              quantity: item.quantity,
              image: data.product.images?.[0]?.imageUrl,
            };
          })
        );
        setLocalCart(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [storeCart]);

  const handleQuantityChange = (productId: string, newQty: number) => {
    setLocalCart((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemove = (productId: string) => {
    setLocalCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const handleProceedToCheckout = () => {
    // Prepare data for API
    const updatedProducts = localCart.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
    }));

    // Call API once
    updateCart(updatedProducts);
  };

  const totalPrice = localCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => router.push("/dashboard")}
            >
              Back to Shop
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Shopping Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {localCart.length === 0 ? (
              <p className="text-gray-600 text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {localCart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.price.toFixed(2)} ETB
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} ETB
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <p className="text-lg font-semibold text-gray-900">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {totalPrice.toFixed(2)} ETB
                  </p>
                </div>
                <Button
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
