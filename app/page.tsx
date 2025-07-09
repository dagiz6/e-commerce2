"use client";

import { useEffect } from 'react';
import { AuthPage } from '@/components/auth/auth-page';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ShoppingBag, LogOut } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, setUser } = useAuthStore();

  useEffect(() => {
    // Check if user is already authenticated on page load
    const token = localStorage.getItem('auth-token');
    if (token && !isAuthenticated) {
      // In a real app, you would validate the token with your backend
      // For demo purposes, we'll just show the auth page
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    useAuthStore.getState().logout();
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </CardTitle>
            <CardDescription className="text-gray-600">
              You are successfully signed in to ShopHub
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ready to Shop?</p>
                  <p className="text-sm text-gray-600">Explore our amazing products</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>User ID:</strong> {user.id}
              </p>
            </div>

            <Button
              onClick={handleLogout}
              className="w-full h-11 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AuthPage />;
}