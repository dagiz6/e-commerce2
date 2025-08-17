"use client";

import { useState } from "react";
import { useProduct } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SingleProductPage({ productId }: { productId: string }) {
  const router = useRouter();
  const { useSingleProduct, updateProduct, deleteProduct } = useProduct();
  const { data: product, isLoading, error } = useSingleProduct(productId);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  if (isLoading) return <p className="text-center mt-8 text-green-600">Loading...</p>;
  if (error || !product) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">Product not found</p>
        <Button onClick={() => router.push("/vendor")}>Back</Button>
      </div>
    );
  }

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    updateProduct({ id: product._id, data: formData });
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    deleteProduct(product._id);
    setShowDeleteConfirm(false);
    router.push("/vendor");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-100 p-6">
      {/* Back Button */}
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Product Card */}
      <div className="bg-white/95 p-6 rounded-lg shadow-lg max-w-xl mx-auto relative z-10">
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

        <div className="flex justify-between mt-6">
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form
              onSubmit={(e) => {
                const form = e.currentTarget;
                const fd = new FormData(form);
                setFormData(fd);
                handleUpdateSubmit(e);
              }}
              className="space-y-4"
            >
              <input type="text" name="name" defaultValue={product.name} className="w-full border rounded p-2" />
              <input type="number" name="price" defaultValue={product.price} className="w-full border rounded p-2" />
              <input type="text" name="category" defaultValue={product.category} className="w-full border rounded p-2" />
              <input type="number" name="stock" defaultValue={product.stock} className="w-full border rounded p-2" />
              <textarea name="description" defaultValue={product.description} className="w-full border rounded p-2" />
              <input type="file" name="images" multiple />

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Product?</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
