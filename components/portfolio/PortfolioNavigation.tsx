import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { SERVICE_PAGES } from "@/lib/services";

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
  {
    label: "Instagram",
    link: "https://www.instagram.com/sthyrastudios?stkn=OGF3dzJudWc5c211",
  },
  {
    label: "LinkedIn",
    link: "https://linkedin.com/company/sthyra/?originalSubdomain=in",
  },
];

export default function PortfolioNavigation() {
  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering={false}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen
      colors={["#d8d5cd", "#aaa69c", "#77736c"]}
      logoUrl="/sthyra_logo_new.png"
      accentColor="#ffffff"
      className="mix-blend-difference"
      isFixed
    />
  );
}
