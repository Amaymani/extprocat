import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/proxy',
      },
    ],
  },
};

export default nextConfig;
