/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avataaars.io",
        port: "",
        pathname: "/**",
      },
      {
        hostname: "dsfcpetefmnkmxpfvxnl.supabase.co",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
