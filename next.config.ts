import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ajoute ici d'autres options de configuration si nécessaire
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
