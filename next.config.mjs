/**@type {import('next').NextConfig}*/
const nextConfig = {
  typescript: {
    // Build ke waqt TypeScript errors ko ignore karega
    ignoreBuildErrors: true,
  },
  eslint: {
    // Build ke waqt ESLint warnings ko ignore karega
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;