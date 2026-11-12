import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server blocks cross-origin requests to its dev assets by default,
  // which leaves the page unhydrated (and blank) when previewed through a
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
