"use client";

import { useEffect } from "react";
import { AuthPage } from "@/components/auth/auth-page";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, ShoppingBag, LogOut } from "lucide-react";

export default function Home() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated and redirect to dashboard
    const token = localStorage.getItem("auth-token");
    if (token && isAuthenticated && user) {
      // User is authenticated, redirect to dashboard
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    useAuthStore.getState().logout();
  };

  // Show loading state while checking authentication
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <AuthPage />;
}
