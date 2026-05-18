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

    return undefined;
  }, [pathname]);

  return null;
}
