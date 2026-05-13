"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AsciiWordHero from "@/components/ascii-word-hero/AsciiWordHero";

const DESKTOP_HERO_MIN_WIDTH = 1100;

type DesktopAsciiHeroProps = {
  onReady?: () => void;
};

export default function DesktopAsciiHero({ onReady }: DesktopAsciiHeroProps) {
  const [showHero, setShowHero] = useState<boolean | null>(null);
  const readyReportedRef = useRef(false);

  const reportReady = useCallback(() => {
    if (readyReportedRef.current) {
      return;
    }

    readyReportedRef.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_HERO_MIN_WIDTH}px)`);
    const updateHero = () => {
      setShowHero(mediaQuery.matches);

      if (!mediaQuery.matches) {
        reportReady();
      }
    };

    updateHero();
    mediaQuery.addEventListener("change", updateHero);

    return () => {
      mediaQuery.removeEventListener("change", updateHero);
    };
  }, [reportReady]);

  if (showHero === null) {
    return <div className="min-h-screen min-h-[100svh] bg-black" aria-hidden="true" />;
  }

  if (!showHero) {
    return null;
  }

  return (
    <AsciiWordHero
      nextSection={<div className="hidden" aria-hidden="true" />}
      onReady={reportReady}
    />
  );
}
