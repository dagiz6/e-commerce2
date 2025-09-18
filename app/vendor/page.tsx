"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useProductStore } from "@/stores/product-store";
import { useProduct } from "@/hooks/use-product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShoppingBag, LogOut, Package, TrendingUp, DollarSign, Users, Plus, BarChart3, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/use-orders";
import Image from "next/image";


interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string; role: string } | null;
  logout: () => void;
}

export default function VendorPage() {
  const { isAuthenticated, user, isLoading: authLoading, logout } = useAuthStore() as AuthStore;
  const { isLoading: productLoading, error, clearError } = useProductStore();
  const { createProduct, isCreatingProduct } = useProduct();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    images: [] as File[],
  });
  const { myOrdersQuery } = useOrders();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) return router.push("/auth/sign-in");
      if (user?.role !== "vendor") {
        router.push(user?.role === "admin" ? "/admin" : "/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    logout();
    router.push("/auth/sign-in");
    toast.success("Logged out successfully");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData({ ...formData, images: Array.from(files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.stock || !formData.images.length) {
      useProductStore.getState().setError("All fields are required, including at least one image.");
      toast.error("All fields are required, including at least one image.");
      return;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      useProductStore.getState().setError("Price must be a positive number.");
      toast.error("Price must be a positive number.");
      return;
    }

    if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      useProductStore.getState().setError("Stock must be a non-negative number.");
      toast.error("Stock must be a non-negative number.");
      return;
    }



    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    formData.images.forEach((file) => data.append("images", file));
    createProduct(data as any);

    setFormData({ name: "", price: "", description: "", category: "", stock: "", images: [] });
    setIsModalOpen(false);
  };
  const ordersData = myOrdersQuery.data;
  const recentOrders =
    ordersData?.orders
      .filter((o) => o.createdAt) // ensure valid dates
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) // newest first
      .slice(0, 4) ?? [];
  

  if (authLoading || productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-teal-100">
        <Loader2 className="h-10 w-10 animate-spin text-green-500" />
        
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "vendor") return null;

  function timeAgo(dateString: string) {
    const diff = Date.now() - new Date(dateString).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Vendor Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center transition-transform hover:scale-105">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user.name}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Vendor
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all hover:shadow-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Manage your products, orders, and grow your business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Products",
              value: `${ordersData?.totalProducts ?? 0}`,
              icon: Package,
              color: "from-blue-500 to-blue-600",
            },
            {
              title: "Total Sales",
              value: `${ordersData?.totalSales.toFixed(2) ?? 0} ETB`,
              icon: DollarSign,
              color: "from-green-500 to-green-600",
            },
            {
              title: "Orders",
              value: ordersData?.totalOrders ?? 0,
              icon: TrendingUp,
              color: "from-purple-500 to-purple-600",
            },
          ].map(({ title, value, icon: Icon, color }) => (
            <Card
              key={title}
              className="border-0 shadow-lg bg-white/95 backdrop-blur-sm transition-transform hover:scale-105"
            >
              <CardContent className="p-8 flex items-center justify-between">
                <div>
                  <p className="text-base md:text-lg font-medium text-gray-600">
                    {title}
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    {value}
                  </p>
                </div>
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="h-8 md:h-10 w-8 md:w-10 text-white" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Quick Actions
              </CardTitle>
              <CardDescription>Manage your store efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full justify-start bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>

              {[
                {
                  text: "Manage Inventory",
                  icon: Package,
                  path: "/vendor/manageProduct",
                },
                {
                  text: "Orders",
                  icon: ShoppingBag,
                  path: "/vendor/orders",
                },
                { text: "Customer Support", icon: Users },
              ].map(({ text, icon: Icon, path }) => (
                <Button
                  key={text}
                  variant="outline"
                  className="w-full justify-start transition-all hover:shadow-md"
                  onClick={() => path && router.push(path)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {text}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Latest orders from your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((o, index) => (
                      <div
                        key={`${o.orderId}-${o.productId}-${o.createdAt}-${index}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-transform hover:scale-[1.02]"
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            src={o.imageUrl || "/placeholder.png"}
                            alt={o.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {o.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {o.quantity} • ETB {o.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end space-y-1">
                          <p className="text-xs text-gray-500">
                            {timeAgo(o.createdAt)}
                          </p>
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                            Processing
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No recent orders yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white/95 rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-4 sm:p-6 max-h-[80vh] overflow-y-auto animate-in fade-in-50 duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => {
                setIsModalOpen(false);
                clearError();
                setFormData({
                  name: "",
                  price: "",
                  description: "",
                  category: "",
                  stock: "",
                  images: [],
                });
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Upload New Product
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Title
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-600 focus:border-green-600 transition-all focus:shadow-lg h-10"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-600 focus:border-green-600 transition-all focus:shadow-lg h-10"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-600 focus:border-green-600 transition-all focus:shadow-lg"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-600 focus:border-green-600 transition-all focus:shadow-lg h-10"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stock"
                      id="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-600 focus:border-green-600 transition-all focus:shadow-lg h-10"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Images
                  </label>
                  <input
                    type="file"
                    name="images"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all"
                    required
                  />
                  {formData.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-32 h-32 object-cover rounded-md shadow-sm hover:shadow-md transition-shadow"
                        />
                      ))}
                    </div>
                  )}
                </div>
                {error && (
                  <p className="text-red-600 text-sm animate-in fade-in-50">
                    {error}
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    onClick={() => {
                      setIsModalOpen(false);
                      clearError();
                      setFormData({
                        name: "",
                        price: "",
                        description: "",
                        category: "",
                        stock: "",
                        images: [],
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingProduct}
                    className="bg-gradient-to-r from-green-600 to-teal-600 text-white transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isCreatingProduct ? "Uploading..." : "Upload Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
}

