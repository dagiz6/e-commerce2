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
  averageRating?: number;
  totalRating?: number;
}

export interface ProductsResponse {
  products: ProductData[];
}

export interface Rating {
  name: string;
  rating: number;
  review?: string;
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  product: ProductData;
  rating: Rating[];
}

export interface CartProduct {
  productId: string;
  quantity: number;
  _id?: string;
}

export interface UsersCart {
  _id: string;
  userId: string;
  products: CartProduct[];
  totalItems: number;
  __v?: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  cart: UsersCart;
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
      // console.error("API Error Response:", {
      //   status: response.status,
      //   statusText: response.statusText,
      //   url,
      // });

      const error = await response.json().catch(() => ({
        message: "Network error occurred",
      }));

      // console.error("API Error Details:", error);
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

    console.log("Auth Token:", token); // Debugging line

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

  async updateProduct(
    id: string,
    data: FormData
  ): Promise<{ message: string }> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request<{ message: string }>(`/products/updateProduct/${id}`, {
      method: "PATCH",
      body: data,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request<{ message: string }>(`/products/deleteProduct/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  async ratingProduct(
    id: string,
    rating: number,
    review?: string
  ): Promise<{ message: string }> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request<{ message: string }>(`/products/rating/${id}`, {
      method: "POST",
      body: JSON.stringify({ rating, review }),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  async addToCart(
    products: { productId: string; quantity: number }[]
  ): Promise<CartResponse> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request<CartResponse>(`/cart/addToCart`, {
      method: "POST",
      body: JSON.stringify({ products }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateCart(
    products: { productId: string; quantity: number }[]
  ): Promise<CartResponse> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request<CartResponse>(`/cart/updateCart`, {
      method: "PATCH",
      body: JSON.stringify({ products }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getMyCart(): Promise<{
    success: boolean;
    message: string;
    cart: {
      _id: string;
      userId: string;
      products: { productId: string; quantity: number; _id: string }[];
      totalItems: number;
    };
  }> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request(`/cart/mycart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createOrder(data: {
    items: { productId: string; quantity: number }[];
    phoneNumber: string;
    address: string;
  }): Promise<any> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request(`/order/createOrder`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async initiatePayment(orderId: string): Promise<any> {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No authentication token found");

    return this.request(`/order/initiatePayment`, {
      method: "POST",
      body: JSON.stringify({ orderId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);