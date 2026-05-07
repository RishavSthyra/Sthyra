"use client";

import { useEffect } from "react";

const BASE_WIDTH = 1600;
const BASE_HEIGHT = 980;
const LAPTOP_WIDTH = 1440;

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
      const laptopBias = width <= LAPTOP_WIDTH ? 0.95 : 1;
      const scale = clamp(Math.min(widthScale, heightScale) * laptopBias, 0.74, 1);
      const gutter = Math.round(clamp(width * 0.014, 10, 24));
      const compactScale = clamp(scale * 0.95, 0.72, 1);

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
