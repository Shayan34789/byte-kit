/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  // Set NEXT_PUBLIC_BASE_PATH=/byte-kit when deploying to a subpath
  // (e.g. GitHub Pages project sites).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
