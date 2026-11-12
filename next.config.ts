import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The dev server blocks cross-origin requests to its dev assets by default,
  // which leaves the page blank (unhydrated) when it is previewed through a
  // hosted proxy. Allow the sandbox preview hosts so scripts and HMR load.
  allowedDevOrigins: ["**.e2b.app", "**.arena.ai", "**.e2b.dev"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
