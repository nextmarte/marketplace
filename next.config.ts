import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Apenas o host público do R2 é permitido no otimizador de imagens.
    remotePatterns: [{ protocol: "https", hostname: "**.r2.dev" }],
    // Imagens de peças são estáticas → cacheia o resultado otimizado por 1 ano
    // (menos leituras no R2 e respostas mais rápidas).
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
