"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
            error: null,
            isLoading: false,
          }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error, isLoading: false }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          }),

        clearError: () => set({ error: null }),

        initializeAuth: () => {
          const token = localStorage.getItem("auth-token");
          const state = get();
          
          // If we have a token but no user state, or vice versa, clear everything
          if ((token && !state.user) || (!token && state.user)) {
            localStorage.removeItem("auth-token");
            set({
              user: null,
              isAuthenticated: false,
              error: null,
              isLoading: false,
            });
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
