"use client";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          About Us
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Welcome to <span className="font-semibold">ShopHub</span>, your
          trusted destination for electronics, fashion, home essentials, and
          accessories. We started with a mission to bring a seamless shopping
          experience to Ethiopia and beyond.
        </p>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Our goal is simple: to make shopping easy, reliable, and affordable
          while ensuring the best customer experience possible. Whether you are
          a student looking for gadgets, a family upgrading your home, or a
          professional seeking quality fashion, ShopHub has something for you.
        </p>

        <p className="text-gray-600 leading-relaxed">
          With secure payments, fast delivery, and 24/7 support, ShopHub is
          building the future of online retail, one happy customer at a time.
        </p>
      </div>
    </div>
  );
}
