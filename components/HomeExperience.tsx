"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import DesktopAsciiHero from "@/components/DesktopAsciiHero";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { SERVICE_PAGES } from "@/lib/services";

const CreateImageFromTiles = dynamic(() => import("@/components/TiledComponent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[7600px] bg-black md:min-h-screen" aria-hidden="true" />
  ),
});

const MobileHomeExperience = dynamic(() => import("@/components/TiledComponentMobile"), {
  ssr: false,
  loading: () => <section className="min-h-screen bg-black" aria-hidden="true" />,
});

const AIChatbot = dynamic(() => import("@/components/AIChatbot"), {
  ssr: false,
  loading: () => null,
});

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
  { label: "Contact", ariaLabel: "Contact Sthyra", link: "/contact" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "X", link: "https://twitter.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export default function HomeExperience() {
  const [heroReady, setHeroReady] = useState(false);
  const [usesDesktopHero, setUsesDesktopHero] = useState<boolean | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const handleHeroReady = useCallback(() => setHeroReady(true), []);
  const shouldHoldForDesktopHero = usesDesktopHero === true && !heroReady;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1100px)");
    const syncLayoutMode = () => {
      setUsesDesktopHero(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setHeroReady(true);
      }
    };

    syncLayoutMode();
    mediaQuery.addEventListener("change", syncLayoutMode);

    return () => {
      mediaQuery.removeEventListener("change", syncLayoutMode);
    };
  }, []);

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
      new CustomEvent("sthyra:lenis-lock", { detail: { locked: shouldHoldForDesktopHero } }),
    );

    if (!shouldHoldForDesktopHero) {
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
  }, [shouldHoldForDesktopHero]);

  useEffect(() => {
    if (!heroReady) {
      return;
    }

    let timeoutId: number | null = null;
    const loadChatbot = () => setShowChatbot(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      timeoutId = idleWindow.requestIdleCallback(loadChatbot, { timeout: 8000 });
    } else {
      timeoutId = window.setTimeout(loadChatbot, 8000);
    }

    const loadOnIntent = () => loadChatbot();
    window.addEventListener("pointerdown", loadOnIntent, { once: true, passive: true });
    window.addEventListener("keydown", loadOnIntent, { once: true });

    return () => {
      if (timeoutId !== null) {
        if (idleWindow.cancelIdleCallback) {
          idleWindow.cancelIdleCallback(timeoutId);
        } else {
          window.clearTimeout(timeoutId);
        }
      }
      window.removeEventListener("pointerdown", loadOnIntent);
      window.removeEventListener("keydown", loadOnIntent);
    };
  }, [heroReady]);

  return (
    <main className="bg-black">
      {shouldHoldForDesktopHero ? (
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
      {usesDesktopHero !== false ? <DesktopAsciiHero onReady={handleHeroReady} /> : null}
      {usesDesktopHero === false ? (
        <MobileHomeExperience
          BASEURL="/villa_tiles_32"
          SECONDARY_BASEURL="/SKYLINE_tiles_32"
        />
      ) : (
        <CreateImageFromTiles
          BASEURL="/villa_tiles_32"
          SECONDARY_BASEURL="/SKYLINE_tiles_32"
          NO_OF_ROWS={4}
          NO_OF_COLUMNS={8}
          TILE_HEIGHT={768}
          TILE_WIDTH={768}
        />
      )}
      {showChatbot ? <AIChatbot /> : null}
    </main>
  );
}
