import type { Metadata } from "next";
import PortfolioIndexExperience from "@/components/portfolio/PortfolioIndexExperience";
import { PORTFOLIO_STORIES } from "@/lib/portfolio-projects";
import { absoluteUrl } from "@/lib/seo";

const description =
  "Explore Sthyra's selected real estate projects through architectural renders, cinematic imagery, interactive web experiences, and immersive walkthroughs.";

export const metadata: Metadata = {
  title: "Selected Projects | Sthyra Portfolio",
  description,
  alternates: { canonical: absoluteUrl("/portfolio") },
  openGraph: {
    title: "Selected Projects | Sthyra Portfolio",
    description,
    url: absoluteUrl("/portfolio"),
    images: [{ url: PORTFOLIO_STORIES[0].heroImage }],
  },
};

export default function PortfolioPage() {
  return <PortfolioIndexExperience />;
}
