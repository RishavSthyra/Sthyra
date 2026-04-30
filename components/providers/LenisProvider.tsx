"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type LenisProviderProps = {
  children: ReactNode;
};

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.45,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 0.9,
      easing: (value) => 1 - Math.pow(1 - value, 3),
    });

    let frame = 0;

    const update = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(update);
    };

    const handleRefresh = () => {
      lenis.resize();
    };

    lenis.on("scroll", ScrollTrigger.update);
    frame = window.requestAnimationFrame(update);
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      lenis.destroy();
    };
  }, []);

  return children;
}
