"use client";

import { useEffect } from "react";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 980;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function useResponsiveScale() {
  useEffect(() => {
    const root = document.documentElement;

    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const widthScale = width / BASE_WIDTH;
      const heightScale = height / BASE_HEIGHT;
      const scale = clamp(Math.min(widthScale, heightScale), 0.8, 1);
      const gutter = Math.round(clamp(width * 0.02, 14, 30));
      const compactScale = clamp(scale * 0.96, 0.78, 1);

      root.style.setProperty("--sthyra-scale", scale.toFixed(3));
      root.style.setProperty("--sthyra-compact-scale", compactScale.toFixed(3));
      root.style.setProperty("--sthyra-safe-gutter", `${gutter}px`);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);
}
