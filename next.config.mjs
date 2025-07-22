/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        unoptimized: true
    },
    experimental: {
        serverComponentsHmrCache: false, // defaults to true
    },
};

export default nextConfig;
 
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();