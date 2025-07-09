"use client";

import { useState } from 'react';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { ForgotPasswordForm } from './forgot-password-form';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <SignInForm
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignUpForm
            onSwitchToSignIn={() => setMode('signin')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSwitchToSignIn={() => setMode('signin')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex">
      {/* Left side - Images */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10" />
        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-8 h-full">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Shopping bags"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Online shopping"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Fashion shopping"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="E-commerce"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>

        {/* Overlay content */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white px-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              Welcome to ShopHub
            </h1>
            <p className="text-xl lg:text-2xl opacity-90 drop-shadow-md">
              Your ultimate e-commerce destination
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 lg:flex-none lg:w-[600px] flex items-center justify-center p-8">
        <div className="w-full max-w-md">{renderForm()}</div>
      </div>
    </div>
  );
};