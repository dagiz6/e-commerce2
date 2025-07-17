import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/stores/auth-store';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'ShopHub - Your E-commerce Destination',
//   description: 'Sign in to your ShopHub account and explore amazing products',
// };

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthInitializer>
            {children}
            <Toaster />
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  );
'use client';
}