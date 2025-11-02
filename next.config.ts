import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Add webpack config for custom Prisma output
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle Prisma custom output
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      });
    }
    return config;
  },

  allowedDevOrigins: [
    '10.1.5.195',
    '10.1.5.0/24',
    '192.168.48.1',
    '192.168.48.0/24',
    '10.0.0.0/8',
    '10.18.58.174',
    '192.168.0.0/16',
    '192.168.1.3',
    '10.18.62.59',
    '10.18.55.6',
    '172.20.10.2',
    '10.18.59.24',
    '10.18.50.201'
  ],

  images: {
    domains: ['img.clerk.com'],
  }
};

export default nextConfig;