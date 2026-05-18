"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToPageStart() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

export default function ServiceScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    scrollToPageStart();

    return undefined;
  }, [pathname]);

  return null;
}
