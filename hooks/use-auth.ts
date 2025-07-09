"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  apiClient,
  SignInData,
  SignUpData,
  ForgotPasswordData,
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
      setUser(response.user);
      setLoading(false);
      toast.success("Successfully signed in!");

      // Store token in localStorage
      localStorage.setItem("auth-token", response.token);

      // Redirect to dashboard
      router.push("/dashboard");
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
      setUser(response.user);
      setLoading(false);
      toast.success("Account created successfully!");

      // Store token in localStorage
      localStorage.setItem("auth-token", response.token);

      // Redirect to dashboard
      router.push("/dashboard");
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

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-token");
    router.push("/auth/sign-in");
    toast.success("Logged out successfully");
  };

  return {
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    logout: handleLogout,
    isLoading:
      signInMutation.isPending ||
      signUpMutation.isPending ||
      forgotPasswordMutation.isPending,
  };
};
