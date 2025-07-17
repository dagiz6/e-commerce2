"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/auth/auth-page";
import { useAuthStore } from "@/stores/auth-store";

export default function SignInPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check both authentication state and token
    const token = localStorage.getItem("auth-token");
    
    if (isAuthenticated && token) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <AuthPage />;
}
