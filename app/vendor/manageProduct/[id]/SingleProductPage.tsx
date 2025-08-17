// app/vendor/manageProduct/[id]/SingleProductPage.tsx
'use client';

import { useProduct } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SingleProductPage({ productId }: { productId: string }) {
  
  const router = useRouter();
  const { useSingleProduct } = useProduct();
  const { data: product, isLoading, error } = useSingleProduct(productId);



  if (isLoading) return <p className="text-center mt-8 text-green-600">Loading...</p>;

  if (error || !product) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">Product not found</p>
        <Button onClick={() => router.push("/manageProduct")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-100 p-6">
            <Button variant="outline" className="mb-6" onClick={() => router.back()}>
              ← Back
            </Button>
      
            <div className="bg-white/95 p-6 rounded-lg shadow-lg max-w-xl mx-auto">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-md mb-4"
                />
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-700 mb-2"><strong>Price:</strong> {product.price} ETB</p>
              <p className="text-gray-700 mb-2"><strong>Category:</strong> {product.category}</p>
              <p className="text-gray-700 mb-2"><strong>Stock:</strong> {product.stock}</p>
              <p className="text-gray-700"><strong>Description:</strong> {product.description}</p>
            </div>
    </div>
  );
}