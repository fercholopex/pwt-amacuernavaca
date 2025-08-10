import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🔹 ignora errores de ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // 🔹 ignora errores de TypeScript
  },
  output: "export",
  basePath: "/out",
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
  }
};


export default nextConfig;

