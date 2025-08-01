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

  const redirectByRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "vendor":
        router.push("/vendor");
        break;
      case "user":
      default:
        router.push("/dashboard");
        break;
    }
  };

  
  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => apiClient.signIn(data),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (response) => {
      // Assuming response contains user and token
      setUser(response.user, response.token, 86400); // Set token to expire in 1 day (86,400 seconds)
      setLoading(false);
      toast.success("Successfully signed in!");

      // Redirect to dashboard
      redirectByRole(response.user.role);
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
  onSuccess: (response: any) => {
    const user = response?.data?.user;
    const token = response?.data?.token;

    if (!user || !user.role) {
      console.error("Signup succeeded but user or role is missing:", response);
      toast.error("Signup failed: user data is incomplete.");
      setLoading(false);
      return;
    }

    setLoading(false);
    toast.success("Account created successfully! Redirecting to sign in...");

    setTimeout(() => {
      router.push("/auth/sign-in");
    }, 200); // Optional delay for UX
  },
  onError: (error: Error) => {
    setError(error.message);
    toast.error(error.message);
    setLoading(false);
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
        router.push("/auth/sign-in?reset=success");
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
    router.push("/auth/sign-in");
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
