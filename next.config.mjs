/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

console.log("=== SERVER STARTUP ===");
console.log("BACKEND_API_SERVER:", process.env.BACKEND_API_SERVER);
console.log("======================");

export default nextConfig;
