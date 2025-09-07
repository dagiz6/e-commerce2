"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-gray-600 mb-8">
          Have questions or need support? Reach out to us, and we’ll get back to
          you as soon as possible.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition">
            <Mail className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Email</h3>
            <p className="text-sm text-gray-600 mt-1">support@shophub.com</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition">
            <Phone className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Phone</h3>
            <p className="text-sm text-gray-600 mt-1">+251 993 941 832</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition">
            <MapPin className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Address</h3>
            <p className="text-sm text-gray-600 mt-1">Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
