import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Empty turbopack config to silence the warning
  // We're using webpack config for Web Workers support
  turbopack: {},

  webpack: (config, { isServer }) => {
    // Support for Web Workers
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: { loader: 'worker-loader' },
    });

    // Configure for transformers.js
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
    };

    // Ignore node-specific modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;


