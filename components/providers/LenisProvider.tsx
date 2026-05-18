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

    const isTouchViewport =
      window.matchMedia("(max-width: 1024px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      autoRaf: false,
      duration: isTouchViewport ? 0.82 : 1.12,
      smoothWheel: true,
      wheelMultiplier: isTouchViewport ? 0.88 : 0.92,
      syncTouch: isTouchViewport,
      touchMultiplier: isTouchViewport ? 1.42 : 1,
      prevent: (node) =>
        node.closest(
          "[data-lenis-prevent], .site-horizontal-scroll, .mobile-transition-carousel",
        ) !== null,
      easing: (value) =>
        isTouchViewport ? 1 - Math.pow(1 - value, 2.4) : 1 - Math.pow(1 - value, 3),
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

    const handleLenisScrollTo = (event: Event) => {
      const customEvent = event as CustomEvent<{
        target?: number | string | HTMLElement;
        offset?: number;
        immediate?: boolean;
      }>;
      const target = customEvent.detail?.target;

      if (target === undefined) {
        return;
      }

      lenis.start();
      lenis.scrollTo(target, {
        duration: customEvent.detail?.immediate ? 0 : 1.05,
        immediate: customEvent.detail?.immediate,
        offset: customEvent.detail?.offset ?? 0,
      });
    };

    lenis.on("scroll", ScrollTrigger.update);
    frame = window.requestAnimationFrame(update);
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    window.addEventListener("sthyra:lenis-lock", handleLenisLock as EventListener);
    window.addEventListener("sthyra:lenis-scroll-to", handleLenisScrollTo as EventListener);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      window.removeEventListener("sthyra:lenis-lock", handleLenisLock as EventListener);
      window.removeEventListener(
        "sthyra:lenis-scroll-to",
        handleLenisScrollTo as EventListener,
      );

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      lenis.destroy();
    };
  }, []);

  return children;
}
