"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import DesktopAsciiHero from "@/components/DesktopAsciiHero";
import CreateImageFromTiles from "@/components/TiledComponent";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import AIChatbot from "@/components/AIChatbot";
import { SERVICE_PAGES } from "@/lib/services";

const serviceMenuItems = SERVICE_PAGES.map((service) => ({
  label: service.hero.eyebrow,
  ariaLabel: `View ${service.hero.eyebrow}`,
  link: `/services/${service.slug}`,
}));

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  {
    label: "Services",
    ariaLabel: "Browse services",
    subItems: serviceMenuItems,
  },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "X", link: "https://twitter.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export default function HomeExperience() {
  const [heroReady, setHeroReady] = useState(false);
  const handleHeroReady = useCallback(() => setHeroReady(true), []);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sthyra:lenis-lock", { detail: { locked: !heroReady } }),
    );

    if (heroReady) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.dispatchEvent(
        new CustomEvent("sthyra:lenis-lock", { detail: { locked: false } }),
      );
    };
  }, [heroReady]);

  return (
    <main className="bg-black">
      {!heroReady ? (
        <div
          className="fixed inset-0 z-[9999] bg-black"
          aria-hidden="true"
        />
      ) : null}
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
      <DesktopAsciiHero onReady={handleHeroReady} />
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
