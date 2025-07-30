"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  ShoppingBag,
  LogOut,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Settings,
  BarChart3,
} from "lucide-react";

// Admin email - only this email can access admin panel
// const ADMIN_EMAIL = process.env.NEXT_ADMIN_EMAIL

export default function AdminPage() {
  const { isAuthenticated, user, isLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to sign-in

    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/sign-in");
        return;
      }

      // If user is not admin or doesn't have admin email, redirect to appropriate page
      if (user && user.role !== "admin") {
        switch (user.role) {
          case "vendor":
            router.push("/vendor");
            break;
          case "client":
            router.push("/dashboard");
            break;
          default:
            router.push("/dashboard");
        }
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    logout();
    router.push("/auth/sign-in");
  };

  // Don't render if user is not authenticated or not admin
  if (
    !isAuthenticated ||
    !user ||
    user.role !== "admin" 
    // ||  user.email !== ADMIN_EMAIL
  ) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Admin
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Administrator!
          </h2>
          <p className="text-gray-600">
            Manage the entire ShopHub platform, users, and system settings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Vendors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">456</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">12,589</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Platform Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">$89,450</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Actions */}
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Admin Actions
              </CardTitle>
              <CardDescription>Platform management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Manage Vendors
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Product Moderation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Platform Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Recent Platform Activity
              </CardTitle>
              <CardDescription>
                Latest system events and user activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "user",
                    action: "New user registration",
                    user: "john.doe@email.com",
                    time: "5 minutes ago",
                  },
                  {
                    type: "vendor",
                    action: "Vendor application approved",
                    user: "tech.store@vendor.com",
                    time: "15 minutes ago",
                  },
                  {
                    type: "product",
                    action: "Product reported for review",
                    user: "Product ID: #12345",
                    time: "30 minutes ago",
                  },
                  {
                    type: "system",
                    action: "System backup completed",
                    user: "Automated",
                    time: "1 hour ago",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : activity.type === "vendor"
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : activity.type === "product"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600"
                            : "bg-gradient-to-r from-gray-500 to-gray-600"
                        }`}
                      >
                        {activity.type === "user" && (
                          <Users className="h-5 w-5 text-white" />
                        )}
                        {activity.type === "vendor" && (
                          <ShoppingBag className="h-5 w-5 text-white" />
                        )}
                        {activity.type === "product" && (
                          <Package className="h-5 w-5 text-white" />
                        )}
                        {activity.type === "system" && (
                          <Settings className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
