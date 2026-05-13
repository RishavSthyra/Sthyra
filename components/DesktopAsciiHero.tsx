"use client";

import { useEffect, useState } from "react";
import AsciiWordHero from "@/components/ascii-word-hero/AsciiWordHero";

const DESKTOP_HERO_MIN_WIDTH = 1100;

export default function DesktopAsciiHero() {
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_HERO_MIN_WIDTH}px)`);
    const updateHero = () => setShowHero(mediaQuery.matches);

    updateHero();
    mediaQuery.addEventListener("change", updateHero);

    return () => {
      mediaQuery.removeEventListener("change", updateHero);
    };
  }, []);

  if (!showHero) {
    return null;
  }

  return <AsciiWordHero nextSection={<div className="hidden" aria-hidden="true" />} />;
}
