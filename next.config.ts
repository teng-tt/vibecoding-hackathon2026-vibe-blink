/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/api/actions/:path*",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" }, // 允许所有来源
            { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,OPTIONS" },
            { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, Content-Encoding, Accept-Encoding" },
          ],
        },
      ];
    },
  };
  
export default nextConfig;