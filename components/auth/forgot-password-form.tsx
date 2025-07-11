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
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface ForgotPasswordFormProps {
  onSwitchToSignIn: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToSignIn,
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { forgotPassword, isSendingResetEmail } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword({ email });
    // Set emailSent to true immediately for better UX
    // The actual success/error will be handled by the toast notifications
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Email Sent!
          </CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your inbox and click the link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700 mb-2">
              <strong>What happens next:</strong>
            </p>
            <ol className="text-xs text-blue-600 list-decimal list-inside space-y-1">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the reset link in the email</li>
              <li>Enter your new password</li>
              <li>Sign in with your new password</li>
            </ol>
          </div>

          <div className="text-center text-sm text-gray-500">
            Didn't receive the email? Check your spam folder.
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="w-full h-11 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-semibold rounded-lg transition-all duration-200"
          >
            Try Again
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/auth/sign-in")}
            className="w-full h-11 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 font-semibold rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }
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
            disabled={isSendingResetEmail}
            className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isSendingResetEmail
              ? "Sending Instructions..."
              : "Send Reset Instructions"}
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
