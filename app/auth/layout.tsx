import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - ShopHub',
  description: 'Sign in or create your ShopHub account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}