"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Product {
  _id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  cart: Product[] | undefined;

  // Actions
  setUser: (user: User | null, token?: string, expiresIn?: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  setState: (partial: Partial<AuthState>) => void;
  setCart: (cart: Product[] | undefined) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true, // Start with isLoading: true to indicate hydration
        error: null,
        cart: [],
        setCart: (cart) => set({ cart }),
        setState: (partial) => set((state) => ({ ...state, ...partial })),

        setUser: (user, token, expiresIn) => {
          if (token && expiresIn) {
            // Store token and expiration time
            const expiresAt = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
            localStorage.setItem("auth-token", token);
            localStorage.setItem("token-expires-at", expiresAt.toString());
          }
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
            error: null,
          });
        },

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error, isLoading: false }),

        logout: () => {
          localStorage.removeItem("auth-token");
          localStorage.removeItem("token-expires-at");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Check token validity when rehydrating
          const token = localStorage.getItem("auth-token");
          const expiresAt = localStorage.getItem("token-expires-at");

          if (token && expiresAt) {
            const now = Date.now();
            if (now < parseInt(expiresAt)) {
              // Token is still valid
              state?.setState({
                isAuthenticated: !!state.user,
                isLoading: false,
              });
            } else {
              // Token expired, clear storage
              localStorage.removeItem("auth-token");
              localStorage.removeItem("token-expires-at");
              state?.setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            // No token, set loading to false
            state?.setState({
              isLoading: false,
            });
          }
        },
      }
    )
  )
);