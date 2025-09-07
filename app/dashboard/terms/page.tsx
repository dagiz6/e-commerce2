"use client";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <p className="text-gray-600 mb-6">
          By using ShopHub, you agree to the following terms and conditions.
          Please read carefully.
        </p>

        <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">
              1. Use of Service
            </h2>
            <p>
              ShopHub provides an e-commerce platform to browse and purchase
              products. You agree not to misuse our platform for illegal
              activities.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Accounts</h2>
            <p>
              Users are responsible for maintaining the security of their
              accounts. Any activity under your account is your responsibility.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">
              3. Orders & Payments
            </h2>
            <p>
              All orders placed on ShopHub must be paid securely. We reserve the
              right to cancel fraudulent or invalid transactions.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">
              4. Returns & Refunds
            </h2>
            <p>
              Products may be returned within 7 days of delivery if defective or
              incorrect. Refunds will be processed according to our policy.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Liability</h2>
            <p>
              ShopHub is not responsible for indirect damages arising from the
              use of our services beyond applicable law.
            </p>
          </section>
        </div>

        <p className="text-gray-600 mt-8">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
