"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";

interface CheckoutFormProps {
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  onClose: () => void;
}

export default function CheckoutForm({
  items,
  total,
  onClose,
}: CheckoutFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
    const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  
    const isValidEthiopianPhone = (phone: string) => {
      const pattern = /^(?:\+2519\d{8}|09\d{8}|07\d{8}|011\d{6})$/;
      return pattern.test(phone);
    };
    
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
      if (!isValidEthiopianPhone(phoneNumber)) {
        setError("Please enter a valid Ethiopian phone number.");
        return;
      }
      setError(null);
  setLoading(true);

  try {
    const response = await apiClient.createOrder({
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      phoneNumber,
      address,
    });

    const orderId = response.order.orderId;

    //  Clear cart immediately when order is confirmed
    await apiClient.updateCart([]);
    clearCart();

    // Initiate payment
    const paymentResponse = await apiClient.initiatePayment(orderId);

    if (paymentResponse?.paymentUrl) {
      window.location.href = paymentResponse.paymentUrl;
    } else {
      router.push(`/orders/${orderId}`);
    }
  } catch (err: any) {
    alert(err.message || "Failed to process payment");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-lg bg-white rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Checkout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} ETB</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2 font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)} ETB</span>
              </div>
            </div>

            <Input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            <Input
              type="text"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-3">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Order"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
