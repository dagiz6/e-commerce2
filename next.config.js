/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true,
  // optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
