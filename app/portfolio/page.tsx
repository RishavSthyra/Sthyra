import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { SERVICE_PAGES } from "@/lib/services";
import { absoluteUrl } from "@/lib/seo";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

const serviceMenuItems = SERVICE_PAGES.map((service) => ({
  label: service.hero.eyebrow,
  ariaLabel: `View ${service.hero.eyebrow}`,
  link: `/services/${service.slug}`,
}));

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Portfolio", ariaLabel: "View our portfolio", link: "/portfolio" },
  {
    label: "Services",
    ariaLabel: "Browse services",
    link: "/services",
    subItems: serviceMenuItems,
  },
  { label: "Contact", ariaLabel: "Contact Sthyra", link: "/contact" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/sthyrastudios?stkn=OGF3dzJudWc5c211" },
  { label: "LinkedIn", link: "https://linkedin.com/company/sthyra/?originalSubdomain=in" },
];

export const metadata: Metadata = {
  title: "Portfolio | Architectural Visualization Work",
  description:
    "Explore Sthyra's portfolio of cinematic real estate films, interactive web experiences, digital twins, ultra-real renders, and immersive AR and VR work.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Sthyra Portfolio | Architectural Visualization Work",
    description:
      "Selected spatial stories, digital experiences, and architectural visualization work by Sthyra.",
    type: "website",
    url: "/portfolio",
    siteName: "Sthyra",
    images: [
      {
        url: absoluteUrl("/images_last_frame.jpg"),
        width: 1200,
        height: 630,
        alt: "Sthyra architectural visualization portfolio",
      },
    ],
  },
};

export default function PortfolioPage() {
  return (
    <main className={`${dmSans.className} h-[100svh] overflow-hidden bg-[#d8d6d1]`}>
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen
        colors={["#a9c9ce", "#d7af88", "#6d7d64"]}
        logoUrl="https://cdn.sthyra.com/sthyra-labs/Images/sthyra_logo_new.png"
        accentColor="#d7af88"
        className="mix-blend-difference"
        isFixed
      />
      <PortfolioGallery />
    </main>
  );
}
