"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  apiClient,
  SignInData,
  SignUpData,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/lib/api";
import { toast } from "sonner";

export const useAuth = () => {
  const { setUser, setLoading, setError, logout, clearError } = useAuthStore();
  const router = useRouter();

  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => apiClient.signIn(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      // Store token in localStorage FIRST
      localStorage.setItem("auth-token", response.token);
      
      // Then set user state
      setUser(response.user);
      setLoading(false);
      toast.success("Successfully signed in!");

      // Use replace instead of push to prevent back navigation issues
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => apiClient.signUp(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      // Store token in localStorage FIRST
      localStorage.setItem("auth-token", response.token);
      
      // Then set user state
      setUser(response.user);
      setLoading(false);
      toast.success("Account created successfully!");

      // Use replace instead of push to prevent back navigation issues
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordData) => apiClient.forgotPassword(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      toast.success(response.message);
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordData) => apiClient.resetPassword(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      setLoading(false);
      toast.success(response.message);
      // The backend will generate a new token and redirect URL
      // For now, redirect to sign-in with success message
      setTimeout(() => {
        router.replace("/auth/sign-in?reset=success");
      }, 2000); // Give user time to see success message
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-token");
    router.replace("/auth/sign-in");
    toast.success("Logged out successfully");
  };

  return {
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    logout: handleLogout,
    isLoading:
      signInMutation.isPending ||
      signUpMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resetPasswordMutation.isPending,
    // Individual loading states for better UX
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};
