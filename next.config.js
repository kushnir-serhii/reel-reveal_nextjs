/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // Turbopack equivalent config for SVG
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    loader: "custom",
    loaderFile: "./src/utils/imageLoader.ts",
    // srcset candidates that match TMDB's pre-sized images, so the browser
    // isn't pushed to a much larger file than it needs.
    imageSizes: [92, 154, 185, 300],
    deviceSizes: [342, 500, 780, 1280, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

module.exports = nextConfig;
