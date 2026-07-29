import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.guides-digitaux.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable Webpack filesystem caching in dev mode to stop ENOENT pack.gz corruption crashes
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
