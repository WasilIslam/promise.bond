import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  typescript: {
    // ⚠️ This allows production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
