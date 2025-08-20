"use client";

import { useState } from "react";
import { useProduct } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";

export default function SingleProductPage({ productId }: { productId: string }) {
  const router = useRouter();
  const { useSingleProduct, useRelatedProducts, useOtherProducts, products, productsLoading } = useProduct();

  // Single Product
  const { data: product, isLoading, error } = useSingleProduct(productId);

  // Related Products → only fetch when we have product
  const { data: relatedProducts, isLoading: relatedLoading } =
    useRelatedProducts(product?.category || "", product?._id || "");
  
  const { data: otherProducts , isLoading : otherLoading} = useOtherProducts(product?._id ?? "");
  

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">("overview");

  if (isLoading) return <p className="text-center mt-8 text-purple-600">Loading...</p>;

  if (error || !product) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">Product not found</p>
        <Button onClick={() => router.push("/dashboard")}>Back</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    console.log("Added to cart:", product, "Qty:", quantity);
  };

  const handleBuyNow = () => {
    console.log("Buy Now clicked:", product, "Qty:", quantity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Product Image + Actions */}
        <div className="lg:col-span-2 bg-white/95 p-6 rounded-lg shadow-lg flex flex-col items-center">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-md mb-6"
            />
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
            >
              -
            </Button>
            <span className="text-lg font-bold">{quantity}</span>
            <Button variant="outline" onClick={() => setQuantity((q) => q + 1)}>
              +
            </Button>
          </div>

          {/* Price that updates with quantity */}
          <p className="text-2xl font-bold text-gray-900 mb-4">
            {(product.price * quantity).toFixed(2)} ETB
          </p>

          {/* Buttons */}
          <div className="flex space-x-4 w-full">
            <Button
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>

        {/* Right: Product Properties */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-700 mb-2">
              <strong>Category:</strong> {product.category}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Stock:</strong> {product.stock}
            </p>

            {/* Rating + Add Review */}
            <div className="flex items-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
              <span className="text-gray-600 text-sm">(12 Reviews)</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => alert("Open review form")}
            >
              Add Review
            </Button>
          </Card>

          {/* Tabs: Overview & Reviews */}
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <div className="flex border-b">
              <button
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "overview"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "reviews"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            <CardContent className="p-4">
              {activeTab === "overview" ? (
                <p className="text-gray-700">{product.description}</p>
              ) : (
                <div>
                  <p className="text-gray-700">User reviews will go here...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Products */}
      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
        Similar Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedLoading ? (
          <p>Loading related products...</p>
        ) : (
          relatedProducts?.map((p: any) => (
            <Card
              key={p._id}
              className="shadow-md border-0 bg-white/90 hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/dashboard/${p._id}`)}
            >
              <CardContent className="p-3">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="h-40 bg-gray-100 rounded-md mb-2" />
                )}
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-600">{p.price} ETB</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Other Products */}
      <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
        Other Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {otherLoading ? (
          <p>Loading products...</p>
        ) : (
          otherProducts?.map((p: any) => (
            <Card
              key={p._id}
              className="shadow-md border-0 bg-white/90 hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/dashboard/${p._id}`)}
            >
              <CardContent className="p-3">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-40 w-full object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="h-40 bg-gray-100 rounded-md mb-2" />
                )}
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-600">{p.price} ETB</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
