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
    let frame = 0;
    let lastScale = "";
    let lastCompactScale = "";
    let lastGutter = "";

    const isDesktopLike = () =>
      window.matchMedia("(min-width: 1100px) and (pointer: fine)").matches;

    const resetHorizontalScroll = () => {
      if (window.scrollX !== 0) {
        window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });
      }

      root.scrollLeft = 0;
      document.body.scrollLeft = 0;
    };

    const updateScale = () => {
      const width = root.clientWidth || window.innerWidth;
      const isMobileTablet = width <= MOBILE_TABLET_MAX_WIDTH;
      const height = isMobileTablet ? BASE_HEIGHT : window.innerHeight;
      const widthScale = width / BASE_WIDTH;
      const heightScale = height / BASE_HEIGHT;
      const laptopBias = width <= LAPTOP_WIDTH ? 0.95 : 1;
      const scale = isMobileTablet
        ? 1
        : clamp(Math.min(widthScale, heightScale) * laptopBias, 0.74, 1);
      const gutter = Math.round(clamp(width * 0.014, 10, 24));
      const compactScale = isMobileTablet ? 1 : clamp(scale * 0.95, 0.72, 1);
      const nextScale = scale.toFixed(3);
      const nextCompactScale = compactScale.toFixed(3);
      const nextGutter = `${gutter}px`;

      if (nextScale !== lastScale) {
        root.style.setProperty("--sthyra-scale", nextScale);
        lastScale = nextScale;
      }

      if (nextCompactScale !== lastCompactScale) {
        root.style.setProperty("--sthyra-compact-scale", nextCompactScale);
        lastCompactScale = nextCompactScale;
      }

      if (nextGutter !== lastGutter) {
        root.style.setProperty("--sthyra-safe-gutter", nextGutter);
        lastGutter = nextGutter;
      }

      resetHorizontalScroll();
    };

    const scheduleUpdateScale = () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateScale();
      });
    };

    updateScale();
    window.addEventListener("resize", scheduleUpdateScale);
    window.addEventListener("orientationchange", scheduleUpdateScale);

    if (isDesktopLike()) {
      window.addEventListener("scroll", resetHorizontalScroll, { passive: true });
      window.visualViewport?.addEventListener("resize", scheduleUpdateScale);
    }

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("resize", scheduleUpdateScale);
      window.removeEventListener("orientationchange", scheduleUpdateScale);
      window.removeEventListener("scroll", resetHorizontalScroll);
      window.visualViewport?.removeEventListener("resize", scheduleUpdateScale);
    };
  }, []);
}
