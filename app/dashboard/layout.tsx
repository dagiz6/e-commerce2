import type { Metadata } from "next";
import DashboardClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Dashboard - ShopHub",
  description: "Your ShopHub dashboard and account overview",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
