import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests in development
  allowedDevOrigins: [
    '10.1.5.195',        // Your actual computer IP
    '10.1.5.0/24',       // Your actual subnet
    '192.168.48.1',      // Next.js detected network IP
    '192.168.48.0/24',   // Next.js detected subnet
    '10.0.0.0/8',
    '10.18.58.174',        // All 10.x.x.x networks
    '192.168.0.0/16',    // All 192.168.x.x networks
    '192.168.1.3',
    '10.18.62.59',
    '10.18.55.6',
    '172.20.10.2',
    '10.18.59.24',
    '10.18.50.201'
  ],

  images:{
    domains:['img.clerk.com'],
  }
  
  // Alternative: Allow all local network IPs (less secure but convenient)
  // allowedDevOrigins: ['*'],
};

export default nextConfig;