import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  async redirects() {
    return [
      {
        source: "/reports/basic-report",
        destination: "/reports",
        permanent: true,
      },
      {
        source: "/reports/professional-report",
        destination: "/reports",
        permanent: true,
      },
      {
        source: "/reports/premium-report",
        destination: "/reports",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
