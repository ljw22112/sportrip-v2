import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol:'https', hostname:'tong.visitkorea.or.kr' },
      { protocol:'https', hostname:'*.visitkorea.or.kr' },
    ],
  },
  /* config options here */
};

export default nextConfig;
