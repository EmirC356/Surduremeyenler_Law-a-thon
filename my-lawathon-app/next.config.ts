import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep these CommonJS packages out of the server bundle so they load from
  // node_modules at runtime. pdf-parse and mammoth read files / use Buffer in
  // ways that Turbopack's bundler mis-handles.
  serverExternalPackages: ['pdf-parse', 'mammoth'],
};

export default nextConfig;
