"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/auth/auth-page";
import { useAuthStore } from "@/stores/auth-store";

export default function SignInPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Don't render auth page if user is authenticated (prevents flash)
  if (isAuthenticated) {
    return null;
  }

  return <AuthPage />;
}
