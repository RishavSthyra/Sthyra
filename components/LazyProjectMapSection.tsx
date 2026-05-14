"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

type Coordinates = readonly [number, number];

type LazyProjectMapSectionProps = {
  projectCoordinates: Coordinates;
  projectLabel?: string;
  cityLabel?: string;
  sectionId?: string;
};

const ProjectMapSection = dynamic(() => import("@/components/ProjectMapSection"), {
  ssr: false,
  loading: () => <section className="min-h-screen bg-black" aria-hidden="true" />,
});

export default function LazyProjectMapSection(props: LazyProjectMapSectionProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell || shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "900px 0px",
      },
    );

    observer.observe(shell);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div ref={shellRef} className="min-h-screen bg-black">
      {shouldLoad ? (
        <ProjectMapSection {...props} />
      ) : (
        <section className="min-h-screen bg-black" aria-hidden="true" />
      )}
    </div>
  );
}
