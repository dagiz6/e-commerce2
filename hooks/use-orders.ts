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
  createdAt?: string;
}

export interface Order {
  orderId: string;
  item: OrderItem;
  createdAt?: string;
  phoneNumber?: string; 
  address?: string; 
}

export interface VendorOrdersResponse {
  _id: string;
  orders: Order[];
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
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
  phone?: string;
  address?: string;
  totalProducts?: number;
}

export const useOrders = () => {
  const myOrdersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: async (): Promise<{
      orders: OrderUI[];
      totalSales: number;
      totalOrders: number;
      customers: number;
      totalProducts: number;
    }> => {
      const data: MyOrdersResponse = await apiClient.getMyOrders();

      if (!data?.result || data.result.length === 0) {
        return { orders: [], totalSales: 0, totalOrders: 0, customers: 0 , totalProducts: 0};
      }

      const vendorOrders = data.result[0];

      const orders: OrderUI[] = vendorOrders.orders.map((o) => {
        const createdAt =
          o.createdAt ||
          o.item.createdAt ||
          o.item.product?.createdAt ||
          new Date().toISOString();

        return {
          orderId: o.orderId,
          createdAt,
          productId: o.item.productId,
          name: o.item.product?.name ?? o.item.name,
          description: o.item.product?.description ?? "",
          imageUrl: o.item.product?.images?.[0]?.imageUrl ?? "/placeholder.png",
          quantity: o.item.quantity,
          price: o.item.price,
          amount: o.item.amount,
          customerId: o.item.customerId,
          phone: o.phoneNumber, 
          address: o.address, 
          
        };
      });

      const sortedOrders = orders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const totalSales = sortedOrders.reduce((sum, o) => sum + o.amount, 0);
      const uniqueCustomers = new Set(
        sortedOrders.map((o) => o.customerId).filter(Boolean)
      ).size;

      return {
        orders: sortedOrders,
        totalSales,
        totalOrders: sortedOrders.length,
        customers: uniqueCustomers,
        totalProducts: vendorOrders.totalProducts,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  return { myOrdersQuery };
};
