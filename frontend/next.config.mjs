// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://10.12.7.7:5000",
    },
  };
  
  module.exports = nextConfig;