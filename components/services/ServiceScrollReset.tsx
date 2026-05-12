"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToPageStart() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  window.dispatchEvent(
    new CustomEvent("sthyra:lenis-scroll-to", {
      detail: {
        target: 0,
        immediate: true,
      },
    }),
  );
}

export default function ServiceScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    scrollToPageStart();

    const frame = window.requestAnimationFrame(scrollToPageStart);
    const timer = window.setTimeout(scrollToPageStart, 80);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
