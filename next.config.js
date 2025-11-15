/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_CESIUM_ION_TOKEN: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glb$/,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
