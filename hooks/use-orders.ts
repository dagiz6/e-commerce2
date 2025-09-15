"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: { imageUrl: string }[];
  price: number;
  category: string;
  stock: number;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  vendorId: string;
  name: string;
  quantity: number;
  price: number;
  amount: number;
  product?: Product;
  customerId?: string;
}

export interface Order {
  orderId: string;
  item: OrderItem;
}

export interface VendorOrdersResponse {
  _id: string;
  orders: Order[];
  totalSales: number;
  totalOrders: number;
}

export interface MyOrdersResponse {
  success: boolean;
  message: string;
  result: VendorOrdersResponse[];
}

export interface OrderUI {
  orderId: string;
  createdAt: string;
  productId: string;
  name: string;
  description: string;
  imageUrl: string;
  quantity: number;
  price: number;
  amount: number;
  customerId?: string;
}

export const useOrders = () => {
  const myOrdersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: async (): Promise<{
      orders: OrderUI[];
      totalSales: number;
      totalOrders: number;
      customers: number;
    }> => {
      const data: MyOrdersResponse = await apiClient.getMyOrders();

      if (!data?.result || data.result.length === 0) {
        return { orders: [], totalSales: 0, totalOrders: 0, customers: 0 };
      }

      const vendorOrders = data.result[0];
      const orders: OrderUI[] = vendorOrders.orders.map((o) => ({
        orderId: o.orderId,
        createdAt: o.item?.product?.createdAt ?? new Date().toISOString(),
        productId: o.item.productId,
        name: o.item.product?.name ?? o.item.name,
        description: o.item.product?.description ?? "",
        imageUrl: o.item.product?.images?.[0]?.imageUrl ?? "",
        quantity: o.item.quantity,
        price: o.item.price,
        amount: o.item.amount,
        customerId: o.item.customerId,
      }));

      const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
      const uniqueCustomers = new Set(
        orders.map((o) => o.customerId).filter(Boolean)
      ).size;

      return {
        orders,
        totalSales,
        totalOrders: orders.length,
        customers: uniqueCustomers,
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 min
  });

  return { myOrdersQuery };
};
