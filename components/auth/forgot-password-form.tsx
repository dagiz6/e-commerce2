"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  onSwitchToSignIn: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToSignIn,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-gray-900">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Enter your email address and we'll send you instructions to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? "Sending Instructions..." : "Send Reset Instructions"}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/auth/sign-in")}
          className="w-full h-11 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-semibold rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </CardContent>
    </Card>
  );
};
