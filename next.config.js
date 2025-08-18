/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // swcMinify: true,
  // optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
