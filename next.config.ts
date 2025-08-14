import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT
  },
  // Configuración explícita para CSS
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  images: {
    domains: ['localhost'],
  },
  // Asegurarse de que webpack procese correctamente los archivos CSS
  webpack(config) {
    return config;
  }
};
export default nextConfig;