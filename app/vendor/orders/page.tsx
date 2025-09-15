"use client";

import { useOrders } from "@/hooks/use-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package } from "lucide-react";

export default function OrdersPage() {
  const { myOrdersQuery } = useOrders();

  if (myOrdersQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-teal-100">
        <Loader2 className="h-10 w-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (myOrdersQuery.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">
          Failed to load orders. Please try again.
        </p>
      </div>
    );
  }

  const orders = myOrdersQuery.data?.orders ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-500">No orders found yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Product",
                        "Customer",
                        "Quantity",
                        "Price",
                        "Total",
                        "Date",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {[...orders] // create a copy so we don't mutate React Query cache
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((o, index) => (
                        <tr
                          key={`${o.orderId}-${o.productId}-${index}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                            <img
                              src={o.imageUrl}
                              alt={o.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <span className="font-medium text-gray-900">
                              {o.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {o.customerId ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {o.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            ETB {o.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                            ETB {o.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
