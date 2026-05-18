"use client";

import { useEffect } from "react";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 980;
const LAPTOP_WIDTH = 1440;
const MOBILE_TABLET_MAX_WIDTH = 1099;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function useResponsiveScale() {
  useEffect(() => {
    const root = document.documentElement;

    const resetHorizontalScroll = () => {
      if (window.scrollX !== 0) {
        window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });
      }

      root.scrollLeft = 0;
      document.body.scrollLeft = 0;
    };

    const updateScale = () => {
      const width = root.clientWidth || window.innerWidth;
      const height = window.innerHeight;
      const widthScale = width / BASE_WIDTH;
      const heightScale = height / BASE_HEIGHT;
      const laptopBias = width <= LAPTOP_WIDTH ? 0.95 : 1;
      const isMobileTablet = width <= MOBILE_TABLET_MAX_WIDTH;
      const scale = isMobileTablet
        ? 1
        : clamp(Math.min(widthScale, heightScale) * laptopBias, 0.74, 1);
      const gutter = Math.round(clamp(width * 0.014, 10, 24));
      const compactScale = isMobileTablet ? 1 : clamp(scale * 0.95, 0.72, 1);

      root.style.setProperty("--sthyra-scale", scale.toFixed(3));
      root.style.setProperty("--sthyra-compact-scale", compactScale.toFixed(3));
      root.style.setProperty("--sthyra-safe-gutter", `${gutter}px`);
      resetHorizontalScroll();
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);
    window.addEventListener("scroll", resetHorizontalScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", updateScale);
    window.visualViewport?.addEventListener("scroll", resetHorizontalScroll);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
      window.removeEventListener("scroll", resetHorizontalScroll);
      window.visualViewport?.removeEventListener("resize", updateScale);
      window.visualViewport?.removeEventListener("scroll", resetHorizontalScroll);
    };
  }, []);
}
