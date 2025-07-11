"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-backend-api.com";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  otp: number;
  password: string;
  token: number;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Log the full request for debugging
    console.log("API Request:", {
      url,
      method: config.method,
      body: config.body,
    });
    const response = await fetch(url, config);

    if (!response.ok) {
      // Enhanced error logging
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        url,
      });

      const error = await response.json().catch(() => ({
        message: "Network error occurred",
      }));

      console.error("API Error Details:", error);
      throw new Error(error.message || "Something went wrong");
    }

    return response.json();
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/forgetPassword", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    // Log what's being sent to backend
    console.log("Reset password request data:", {
      otp: data.otp ? "present" : "missing",
      password: data.password ? "present" : "missing",
      token: data.token,
      otpValue: data.otp,
    });

    return this.request<{ message: string }>("/auth/resetPassword", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
