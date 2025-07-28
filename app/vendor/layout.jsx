import { Metadata } from 'next';

export const metadata = {
  title: 'Vendor Dashboard - ShopHub',
  description: 'Manage your products and orders on ShopHub',
};

export default function VendorLayout({ children }) {
  return children;
}