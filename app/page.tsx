"use client";

import { useEffect } from "react";
import { AuthPage } from "@/components/auth/auth-page";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, ShoppingBag, LogOut } from "lucide-react";
import DashboardLayout from "./dashboard/layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import { useRouter } from "next/navigation";  


export default function Home() {
  const { isAuthenticated, user, setUser } = useAuthStore();
   const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      </div>
      
    );
  }


