import AsciiWordHero from "@/components/ascii-word-hero/AsciiWordHero";
import CreateImageFromTiles from "@/components/TiledComponent";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import AIChatbot from "@/components/AIChatbot";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  // { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Services", ariaLabel: "View our services", link: "/services/ultra-real-real-estate-renders" },
  // { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "X", link: "https://twitter.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export default function Home() {
  return (
    <main className="bg-black">
     <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering
      menuButtonColor="#f7f7f5"
      openMenuButtonColor="#ffffff"
     changeMenuColorOnOpen
      colors={["#171717", "#0d0d0d", "#050505"]}
      logoUrl="https://cdn.sthyra.com/sthyra-labs/Images/sthyra_logo_new.png"
      accentColor="#ffffff"
      isFixed
     />
     <AsciiWordHero nextSection={<div className="hidden" aria-hidden="true" />} />
     <CreateImageFromTiles
      BASEURL="/villa_tiles_32"
      SECONDARY_BASEURL="/SKYLINE_tiles_32"
      NO_OF_ROWS={4}
      NO_OF_COLUMNS={8}
      TILE_HEIGHT={768}
      TILE_WIDTH={768}
     />
     <AIChatbot />
    </main>
  );
}
