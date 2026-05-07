"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useResponsiveScale from "@/hooks/useResponsiveScale";

type LenisProviderProps = {
  children: ReactNode;
};

export default function LenisProvider({ children }: LenisProviderProps) {
  useResponsiveScale();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.9,
      smoothWheel: true,
      wheelMultiplier: 0.58,
      touchMultiplier: 0.72,
      easing: (value) => 1 - Math.pow(1 - value, 4),
    });

    let frame = 0;

    const update = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(update);
    };

    const handleRefresh = () => {
      lenis.resize();
    };

    const handleLenisLock = (event: Event) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>;

      if (customEvent.detail?.locked) {
        lenis.stop();
        return;
      }

      lenis.start();
    };

    lenis.on("scroll", ScrollTrigger.update);
    frame = window.requestAnimationFrame(update);
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    window.addEventListener("sthyra:lenis-lock", handleLenisLock as EventListener);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      window.removeEventListener("sthyra:lenis-lock", handleLenisLock as EventListener);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      lenis.destroy();
    };
  }, []);

  return children;
}
