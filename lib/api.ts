"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token?: string; // body token
  message: string;
}

export interface ProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  images: string[];
}

export interface ProductsResponse {
  products: ProductData[];
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T & { tokenFromHeader?: string }> {
    const url = `${this.baseUrl}${endpoint}`;

    
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const config: RequestInit = {
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const tokenFromHeader = response.headers.get("Authorization") || undefined;

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Network error occurred",
      }));
      throw new Error(error.message || "Something went wrong");
    }

    const data = await response.json();
    return { ...data, tokenFromHeader };
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    const result = await this.request<AuthResponse>("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.tokenFromHeader) {
      const cleanToken = result.tokenFromHeader.replace("Bearer ", "");
      localStorage.setItem("token", cleanToken);
    } else if (result.token) {
      localStorage.setItem("token", result.token);
    }

    return result;
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createProduct(data: FormData): Promise<{ message: string }> {
    return this.request<{ message: string }>("/products/createProduct", {
      method: "POST",
      body: data, 
    
    });
  }

  async getAllProducts(): Promise<ProductsResponse> {
    return this.request<ProductsResponse>("/products/allProducts", {
      method: "GET",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
