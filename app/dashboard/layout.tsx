import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - ShopHub",
  description: "Your ShopHub dashboard and account overview",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
