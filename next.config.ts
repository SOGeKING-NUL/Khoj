import type { NextConfig } from "next";
// @ts-ignore - next-pwa doesn't have types
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {}, // Silence turbopack warning
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Use webpack for PWA (next-pwa doesn't support turbopack yet)
  buildExcludes: [/middleware-manifest\.json$/],
})(nextConfig);
