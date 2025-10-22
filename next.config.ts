import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "github.com" },
            { protocol: "https", hostname: "**.supabase.co" },
            { protocol: "https", hostname: "images.unsplash.com" },
            // { protocol: "https", hostname: "cdn.your-cdn.com" }, // add if you use another CDN
        ],
    },
};

export default nextConfig;
