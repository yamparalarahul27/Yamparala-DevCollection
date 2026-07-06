import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // /api/component-source reads component source files from disk at request
  // time; make sure they ship with the serverless function bundle.
  outputFileTracingIncludes: {
    "/api/component-source": [
      "./src/**/*",
      "./public/pointer.svg",
      "./public/pointerdown.svg",
    ],
  },
};

export default nextConfig;
