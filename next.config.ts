import type { NextConfig } from "next";

const configuredPortfolioBaseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_ASSET_BASE_URL;

function getPortfolioRemotePattern() {
  if (!configuredPortfolioBaseUrl) return null;

  try {
    const url = new URL(configuredPortfolioBaseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;

    return {
      protocol: url.protocol.slice(0, -1) as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/+$/, "")}/**`,
    };
  } catch {
    return null;
  }
}

const portfolioRemotePattern = getPortfolioRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sthyra.com",
      },
      ...(portfolioRemotePattern ? [portfolioRemotePattern] : []),
    ],
  },
};

export default nextConfig;
