import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "updc-dev.zijela.com",
  },
  {
    protocol: "http",
    hostname: "161.97.116.56",
  },
  {
    protocol: "https",
    hostname: "api.budpay.com",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
