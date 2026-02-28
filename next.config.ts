import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: false,
    images: {
        dangerouslyAllowLocalIP: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
            },
            {
                protocol: 'https',
                hostname: 'onecamp.minio.onemana.dev',
            },
            {
                protocol: 'http',
                hostname: 'onecamp.minio.onemana.dev',
            }
        ],
    },

};

export default nextConfig;
