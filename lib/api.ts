"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: string; 
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  otp: number;
  newPassword: string;
}


export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    // avatar?: string;
  };
  token: string;
  message: string;
}

export interface ProductImage {
  imageUrl: string;
  imageId: string;
  _id: string;
}

export interface ProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: ProductImage[];
}

export interface ProductsResponse {
  products: ProductData[];
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  product: ProductData;
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
    // console.log("API Request:", {
    //   url,
    //   method: config.method,
    //   body: config.body,
    // });
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
      password: data.newPassword ? "present" : "missing",
      otpValue: data.otp,
    });

    return this.request<{ message: string }>("/auth/resetPassword", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createProduct(data: FormData): Promise<{ message: string }> {
    const token = localStorage.getItem("auth-token");
    return this.request<{ message: string }>("/products/createProduct", {
      method: "POST",
      body: data,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
  async getAllProducts(): Promise<ProductsResponse> {
    return this.request<ProductsResponse>("/products/allProducts", {
      method: "GET",
    });
  }

  async getMyProducts(): Promise<ProductsResponse> {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      throw new Error("No authentication token found");
    }
    return this.request<ProductsResponse>("/products/myProducts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async singleProduct(id: string): Promise<SingleProductResponse> {
    return this.request<SingleProductResponse>(
      `/products/singleProduct/${id}`,
      {
        method: "GET",
      }
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);