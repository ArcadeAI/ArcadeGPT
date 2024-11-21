import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {},
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    ARCADE_API_KEY: process.env.ARCADE_API_KEY,
    ARCADE_ENGINE_URL: process.env.ARCADE_ENGINE_URL,
  },
};

export default nextConfig;
