"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TILECOMBININGTYPES {
  BASEURL: string;
  SECONDARY_BASEURL?: string;
  NO_OF_ROWS: number;
  NO_OF_COLUMNS: number;
  TILE_HEIGHT: number;
  TILE_WIDTH: number;
}

type PostSkylineTileMode = "black" | "white" | "image";

type PostSkylineTileConfig = {
  row: number;
  col: number;
  mode: PostSkylineTileMode;
  label?: string;
  title?: string;
  align?: "start" | "end";
  imageSrc?: string;
  imageAlt?: string;
};

const TEXT_CARDS = [
  {
    row: 1,
    col: 2,
    rowSpan: 1,
    colSpan: 2,
    title: "Open to Sky",
    text: "A calm villa experience shaped by light, landscape, and privacy.",
  },
  {
    row: 1,
    col: 5,
    rowSpan: 1,
    colSpan: 2,
    title: "Rooted in Green",
    text: "Garden edges, warm lighting, and nature-led living at every step.",
  },
  {
    row: 2,
    col: 6,
    rowSpan: 1,
    colSpan: 2,
    title: "Luxury Living",
    text: "Architecture, interiors, and outdoor spaces stitched into one premium story.",
  },
];

const FEATURE_TILE = {
  row: 1,
  col: 1,
};

const ARCHVIZ_HEADLINE = [
  "TRANSFORMING SPACES",
  "INTO ARCHVIZ STORIES",
];

const POST_SKYLINE_HEADLINE = [
  "SCULPTING 3D",
  "INTO LIVED SPACES",
];

const POST_SKYLINE_PARAGRAPH =
  "Sthyra creates premium architectural visualization and 3D rendering for homes, interiors, and real estate, turning design ideas into cinematic, market-ready spatial stories.";

const POST_SKYLINE_TILES: PostSkylineTileConfig[] = [
  {
    row: 2,
    col: 0,
    mode: "white",
  },
  {
    row: 1,
    col: 3,
    mode: "image",
    imageSrc:
      "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300901.jpeg",
    imageAlt: "Luxury entry interior",
  },
  {
    row: 1,
    col: 5,
    mode: "image",
    imageSrc:
      "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300850.jpeg",
    imageAlt: "Luxury timber interior",
  },
  {
    row: 2,
    col: 4,
    mode: "image",
    imageSrc:
      "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300851.jpeg",
    imageAlt: "Luxury stone interior corridor",
  },
  {
    row: 3,
    col: 7,
    mode: "white",
    label: "Show More ++",
    align: "end",
  },
];

const POST_SKYLINE_TILE_MAP = new Map(
  POST_SKYLINE_TILES.map((tile) => [`${tile.row}_${tile.col}`, tile]),
);

function getTileWaveDelay(row: number, col: number) {
  const rowBias = row * 0.055;
  const colDrift = col * 0.016;
  const variance = ((((row + 1) * 11 + (col + 1) * 7) % 5) + 1) * 0.024;

  return rowBias + colDrift + variance;
}

function getTileCoverDuration(row: number, col: number) {
  return 0.52 + ((((row + 1) * 17 + (col + 1) * 13) % 6) + 1) * 0.085;
}

function getSkylineRevealDelay(row: number, col: number) {
  const distanceFromFeature = Math.abs(row - FEATURE_TILE.row) + Math.abs(col - FEATURE_TILE.col);
  const variance = ((((row + 3) * 19 + (col + 5) * 23) % 7) + 1) * 0.028;

  return distanceFromFeature * 0.06 + variance;
}

function getPostSkylineDelay(row: number, col: number) {
  const centerRow = 1.5;
  const centerCol = 3.5;
  const distance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  const variance = ((((row + 2) * 13 + (col + 4) * 17) % 6) + 1) * 0.022;

  return distance * 0.05 + variance;
}

function getPostSkylineTile(row: number, col: number) {
  return POST_SKYLINE_TILE_MAP.get(`${row}_${col}`);
}

export default function CreateImageFromTiles({
  BASEURL,
  SECONDARY_BASEURL = "/SKYLINE_tiles_32",
  NO_OF_ROWS,
  NO_OF_COLUMNS,
  TILE_HEIGHT,
  TILE_WIDTH,
}: TILECOMBININGTYPES) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const imageWidth = NO_OF_COLUMNS * TILE_WIDTH;
  const imageHeight = NO_OF_ROWS * TILE_HEIGHT;
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const modulePanel = {
    row: NO_OF_ROWS - 1,
    col: NO_OF_COLUMNS - 2,
    rowSpan: 1,
    colSpan: 2,
    eyebrow: "Next Module",
    title: "Atmosphere tuned for architecture",
    text: "Archviz studies align material depth, camera rhythm, and daylight before the build begins.",
  };
  const compactModulePanel = {
    eyebrow: "Skyline",
    title: "Urban frame",
    text: "A compressed archviz study for the next reveal.",
  };
  const isFeatureTile = (row: number, col: number) =>
    row === FEATURE_TILE.row && col === FEATURE_TILE.col;
  const isFeatureColumnTile = (row: number, col: number) =>
    col === FEATURE_TILE.col && row !== FEATURE_TILE.row;

  useLayoutEffect(() => {
    const syncViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const headlineBlock = stage?.querySelector<HTMLElement>(".headline-block") ?? null;
      const featureCell = stage?.querySelector<HTMLElement>(".feature-cell") ?? null;

      if (!stage) {
        return;
      }

      gsap.set(stage, {
        transformOrigin: "50% 100%",
        scale: 0.94,
        yPercent: 0,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        clipPath: "inset(8% 0% 0% 0% round 22px 22px 0px 0px)",
      });
      gsap.set(".non-feature-panel", {
        scaleY: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set(".skyline-expansion-tile", {
        opacity: 0,
        scale: 1.035,
      });
      gsap.set(".skyline-feature-tile", {
        opacity: 0,
        scale: 1.02,
      });
      gsap.set(".skyline-column-top", {
        scaleY: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set(".skyline-column-bottom", {
        scaleY: 0,
        transformOrigin: "50% 0%",
      });
      gsap.set(".module-panel", {
        opacity: 0,
        y: 22,
      });
      gsap.set(".module-panel-final", {
        opacity: 0,
      });
      gsap.set(".post-skyline-panel", {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      });
      gsap.set(".post-skyline-copy", {
        opacity: 0,
        y: 18,
      });
      gsap.set(".post-global-headline", {
        opacity: 0,
      });
      gsap.set(".post-global-headline-char", {
        opacity: 0,
        xPercent: -24,
      });
      gsap.set(".post-global-paragraph", {
        opacity: 0,
        x: -26,
      });
      gsap.set(".post-skyline-image-frame", {
        opacity: 0,
        y: 18,
        scale: 0.98,
      });
      gsap.set(".post-skyline-image", {
        scale: 1.08,
        filter: "brightness(0.94) saturate(0.88)",
      });
      gsap.set(".headline-block", {
        opacity: 0,
        x: 0,
      });
      gsap.set(".headline-char", {
        yPercent: 0,
        opacity: 1,
      });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top top",
          scrub: 1.15,
        },
      });

      revealTl.to(
        stage,
        {
          scale: 1,
          yPercent: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
          ease: "power2.out",
        },
        0,
      );

      revealTl.to(
        ".tile-mask",
        {
          opacity: 0,
          ease: "none",
        },
        0,
      );

      revealTl.fromTo(
        ".tile-shell",
        {
          filter: "brightness(0.68) saturate(0.8)",
        },
        {
          filter: "brightness(1) saturate(1)",
          ease: "none",
        },
        0,
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=5600",
          scrub: 1.25,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(".tile-image", {
        opacity: 0.72,
        scale: 0.995,
        stagger: {
          amount: 0.35,
          from: "center",
        },
        ease: "none",
      });

      tl.to(
        ".tile-shell",
        {
          scale: 1.015,
          ease: "none",
        },
        0,
      );

      tl.fromTo(
        ".card-reveal",
        { xPercent: -105 },
        {
          xPercent: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
        },
        0.25,
      );

      tl.to(
        ".card-content",
        {
          opacity: 1,
          duration: 0.25,
          stagger: 0.18,
        },
        0.65,
      );

      tl.to(
        ".card-reveal",
        {
          xPercent: 105,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.inOut",
        },
        0.85,
      );

      tl.to(
        ".card-content, .info-card",
        {
          opacity: 0,
          duration: 0.34,
          stagger: 0.04,
          ease: "power2.out",
        },
        1.02,
      );

      const nonFeaturePanels = gsap.utils.toArray<HTMLElement>(".non-feature-panel");

      nonFeaturePanels.forEach((panel) => {
        const delay = Number(panel.dataset.waveDelay ?? 0);
        const duration = Number(panel.dataset.coverDuration ?? 0.8);

        tl.to(
          panel,
          {
            scaleY: 1,
            duration,
            ease: "power3.inOut",
          },
          1.06 + delay,
        );
      });

      tl.to(
        ".feature-tile",
        {
          opacity: 1,
          scale: 1.08,
          filter: "brightness(1.06) saturate(1.04)",
          ease: "power2.out",
        },
        1.34,
      );

      tl.to(
        ".feature-tile",
        {
          opacity: 0,
          duration: 0.42,
          ease: "power2.inOut",
        },
        2.02,
      );

      tl.to(
        ".skyline-feature-tile",
        {
          opacity: 1,
          scale: 1,
          duration: 0.52,
          ease: "power2.inOut",
        },
        2.02,
      );

      tl.to(
        ".skyline-column-top",
        {
          scaleY: 1,
          duration: 0.7,
          stagger: {
            each: 0.1,
            from: "end",
          },
          ease: "power2.out",
        },
        2.34,
      );

      tl.to(
        ".skyline-column-bottom",
        {
          scaleY: 1,
          duration: 0.7,
          stagger: {
            each: 0.1,
            from: "start",
          },
          ease: "power2.out",
        },
        2.34,
      );

      if (headlineBlock) {
        tl.to(
          headlineBlock,
          {
            opacity: 1,
            x: 0,
            duration: 0.42,
            ease: "power2.out",
          },
          2.58,
        );

        tl.to(
          headlineBlock,
          {
            x: () => {
              const blockRect = headlineBlock.getBoundingClientRect();
              const featureRect = featureCell?.getBoundingClientRect();
              const viewportPadding = window.innerWidth < 768 ? 12 : 24;
              const desiredLeft = featureRect
                ? featureRect.left - Math.min(blockRect.width * 0.2, 88)
                : viewportPadding;
              const maxLeft = Math.max(
                viewportPadding,
                window.innerWidth - blockRect.width - viewportPadding,
              );
              const clampedLeft = Math.min(
                Math.max(desiredLeft, viewportPadding),
                maxLeft,
              );

              return clampedLeft - blockRect.left;
            },
            duration: 0.82,
            ease: "power2.out",
          },
          2.84,
        );
      }

      tl.to(
        ".module-panel",
        {
          opacity: 1,
          y: 0,
          duration: 0.64,
          ease: "power2.out",
        },
        3.28,
      );

      const skylineExpansionTiles = gsap.utils.toArray<HTMLElement>(".skyline-expansion-tile");

      skylineExpansionTiles.forEach((tile) => {
        const delay = Number(tile.dataset.skylineDelay ?? 0);

        tl.to(
          tile,
          {
            opacity: 1,
            scale: 1,
            duration: 0.68,
            ease: "power2.out",
          },
          3.8 + delay,
        );
      });

      tl.to(
        ".headline-char",
        {
          yPercent: 132,
          opacity: 0,
          duration: 0.5,
          stagger: 0.01,
          ease: "power2.in",
        },
        4.26,
      );

      if (headlineBlock) {
        tl.to(
          headlineBlock,
          {
            opacity: 0,
            duration: 0.24,
            ease: "none",
          },
          4.54,
        );
      }

      tl.to(
        ".module-panel-primary",
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        4.4,
      );

      tl.to(
        ".module-panel",
        {
          left: `${((NO_OF_COLUMNS - 1) / NO_OF_COLUMNS) * 100}%`,
          width: `${(1 / NO_OF_COLUMNS) * 100}%`,
          duration: 0.72,
          ease: "power3.inOut",
        },
        4.48,
      );

      tl.to(
        ".module-panel-final",
        {
          opacity: 1,
          duration: 0.36,
          ease: "power2.out",
        },
        4.84,
      );

      tl.to(
        ".tile-shell",
        {
          backgroundColor: "#000000",
          ease: "none",
        },
        1.08,
      );

      const postSkylinePanels = gsap.utils.toArray<HTMLElement>(".post-skyline-panel");

      postSkylinePanels.forEach((panel) => {
        const delay = Number(panel.dataset.postDelay ?? 0);

        tl.to(
          panel,
          {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            ease: "power3.inOut",
          },
          5.24 + delay,
        );
      });

      tl.to(
        ".module-panel",
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        5.12,
      );

      tl.to(
        ".tile-shell",
        {
          backgroundColor: "#ffffff",
          duration: 0.82,
          ease: "power2.inOut",
        },
        5.14,
      );

      tl.to(
        ".skyline-tile",
        {
          opacity: 0,
          duration: 0.82,
          ease: "power2.inOut",
        },
        5.26,
      );

      tl.to(
        ".post-skyline-copy",
        {
          opacity: 1,
          y: 0,
          duration: 0.54,
          stagger: 0.06,
          ease: "power2.out",
        },
        5.58,
      );

      tl.to(
        ".post-skyline-image-frame",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        },
        5.66,
      );

      tl.to(
        ".post-global-headline",
        {
          opacity: 1,
          duration: 0.22,
          ease: "none",
        },
        5.58,
      );

      tl.to(
        ".post-global-headline-char",
        {
          opacity: 1,
          xPercent: 0,
          duration: 0.38,
          stagger: 0.014,
          ease: "power2.out",
        },
        5.62,
      );

      tl.to(
        ".post-global-paragraph",
        {
          opacity: 1,
          x: 0,
          duration: 0.54,
          ease: "power2.out",
        },
        5.94,
      );

      tl.to(
        ".post-global-paragraph",
        {
          opacity: 0,
          x: 26,
          duration: 0.42,
          ease: "power2.in",
        },
        6.84,
      );

      tl.to(
        ".post-skyline-image",
        {
          scale: 1,
          filter: "brightness(1) saturate(1)",
          duration: 1,
          stagger: 0.12,
          ease: "power2.out",
        },
        5.66,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [NO_OF_COLUMNS, NO_OF_ROWS]);

  const imageAspect = imageWidth / imageHeight;
  const viewportAspect =
    viewport.width > 0 && viewport.height > 0
      ? viewport.width / viewport.height
      : imageAspect;

  const coverWidth =
    viewportAspect > imageAspect
      ? viewport.width
      : viewport.height * imageAspect;
  const coverHeight =
    viewportAspect > imageAspect
      ? viewport.width / imageAspect
      : viewport.height;
  const offsetX = (viewport.width - coverWidth) / 2;
  const offsetY = (viewport.height - coverHeight) / 2;

  return (
    <section
      ref={sectionRef}
      className="relative z-[8] -mt-[22vh] min-h-screen overflow-visible bg-transparent md:-mt-[24vh]"
    >
      <div
        className="tile-mask pointer-events-none absolute inset-x-0 top-0 z-[9] h-48 md:h-64"
        style={{
          background:
            "linear-gradient(180deg, rgba(4, 4, 4, 0.86) 0%, rgba(3, 3, 3, 0.48) 46%, rgba(1, 1, 1, 0) 100%)",
        }}
      />
      <div className="relative h-screen w-screen overflow-hidden">
        <div
          ref={stageRef}
          className="tile-stage absolute inset-x-0 bottom-0 h-screen w-screen overflow-hidden shadow-[0_-18px_70px_rgba(0,0,0,0.22)]"
        >
          <div
            className="tile-shell relative h-screen w-screen overflow-hidden bg-black"
            style={{
              width: viewport.width > 0 ? `${viewport.width}px` : "100vw",
              height: viewport.height > 0 ? `${viewport.height}px` : "100vh",
            }}
          >
            <div
              className="absolute inset-x-0 top-0 z-[4] h-[8vh] bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.03)_58%,transparent_100%)]"
              aria-hidden="true"
            />
            <div
              className="absolute"
              style={{
                left: `${offsetX}px`,
                top: `${offsetY}px`,
                width: `${coverWidth}px`,
                height: `${coverHeight}px`,
              }}
            >
              {Array.from({ length: NO_OF_ROWS }).map((_, row) =>
                Array.from({ length: NO_OF_COLUMNS }).map((_, col) => {
                  const featureTile = isFeatureTile(row, col);
                  const featureColumnTile = isFeatureColumnTile(row, col);
                  const postSkylineTile = getPostSkylineTile(row, col);
                  const postSkylineIsImage = postSkylineTile?.mode === "image";
                  const postSkylinePanelClass = "bg-white text-black";
                  const skylineColumnClass =
                    row < FEATURE_TILE.row
                      ? "skyline-column-top"
                      : "skyline-column-bottom";
                  const skylineClass = featureTile
                    ? "skyline-tile skyline-feature-tile absolute inset-0 z-[2] h-full w-full object-fill"
                    : featureColumnTile
                      ? `skyline-tile absolute inset-0 z-[3] h-full w-full object-fill ${skylineColumnClass}`
                      : "skyline-tile skyline-expansion-tile absolute inset-0 z-[3] h-full w-full object-fill";

                  return (
                  <div
                    key={`${row}_${col}`}
                    className={[
                      "tile-cell absolute overflow-hidden",
                      featureTile ? "feature-cell" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      left: `${(col / NO_OF_COLUMNS) * 100}%`,
                      top: `${(row / NO_OF_ROWS) * 100}%`,
                      width: `${100 / NO_OF_COLUMNS}%`,
                      height: `${100 / NO_OF_ROWS}%`,
                    }}
                  >
                    <Image
                      src={`${BASEURL}/tile_${row}_${col}.jpg`}
                      alt=""
                      width={TILE_WIDTH}
                      height={TILE_HEIGHT}
                      unoptimized
                      className={[
                        "tile-image absolute inset-0 h-full w-full object-fill",
                        featureTile ? "feature-tile" : "non-feature-tile",
                      ].join(" ")}
                    />
                    {featureTile ? (
                      <Image
                        src={`${SECONDARY_BASEURL}/tile_${row}_${col}.jpg`}
                        alt=""
                        width={TILE_WIDTH}
                        height={TILE_HEIGHT}
                        unoptimized
                        className={skylineClass}
                      />
                    ) : (
                      <Image
                        src={`${SECONDARY_BASEURL}/tile_${row}_${col}.jpg`}
                        alt=""
                        width={TILE_WIDTH}
                        height={TILE_HEIGHT}
                        unoptimized
                        className={skylineClass}
                        data-skyline-delay={getSkylineRevealDelay(row, col).toFixed(3)}
                      />
                    )}
                    {!featureTile ? (
                      <div
                        className="non-feature-panel absolute inset-0 z-[2] border border-white/6 bg-black"
                        data-wave-delay={getTileWaveDelay(row, col).toFixed(3)}
                        data-cover-duration={getTileCoverDuration(row, col).toFixed(3)}
                      />
                    ) : null}
                      <div
                        className={[
                        "post-skyline-panel absolute -inset-px z-[4] overflow-hidden",
                        postSkylinePanelClass,
                      ].join(" ")}
                      data-post-delay={getPostSkylineDelay(row, col).toFixed(3)}
                    >
                      {postSkylineTile?.label || postSkylineTile?.title ? (
                        <div
                          className={[
                            "post-skyline-copy absolute inset-0 flex flex-col",
                            postSkylineTile.align === "end"
                              ? "items-end justify-end p-2 text-right md:p-3"
                              : postSkylineTile.title
                                ? "items-start justify-center p-3 text-left md:p-4"
                                : "items-start justify-start p-3 text-left md:p-4",
                          ].join(" ")}
                        >
                          {postSkylineTile.label ? (
                            <p className="m-0 text-[9px] font-semibold uppercase leading-none tracking-[-0.03em] md:text-[10px]">
                              {postSkylineTile.label}
                            </p>
                          ) : null}
                          {postSkylineTile.title ? (
                            <h3 className="m-0 max-w-[6ch] text-[clamp(1.75rem,2vw,2.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.06em]">
                              {postSkylineTile.title}
                            </h3>
                          ) : null}
                        </div>
                      ) : null}
                      {postSkylineIsImage && postSkylineTile.imageSrc ? (
                        <div className="post-skyline-image-frame absolute -inset-px overflow-hidden">
                          <Image
                            src={postSkylineTile.imageSrc}
                            alt={postSkylineTile.imageAlt ?? ""}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, 16vw"
                            className="post-skyline-image object-cover"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  );
                }),
              )}

              <div
                className="module-panel absolute z-[4] flex flex-col justify-between border border-black/12 bg-white p-5 text-black md:p-6"
                style={{
                  left: `${(modulePanel.col / NO_OF_COLUMNS) * 100}%`,
                  top: `${(modulePanel.row / NO_OF_ROWS) * 100}%`,
                  width: `${(modulePanel.colSpan / NO_OF_COLUMNS) * 100}%`,
                  height: `${(modulePanel.rowSpan / NO_OF_ROWS) * 100}%`,
                }}
              >
                <div className="module-panel-primary flex h-full flex-col justify-between">
                  <p className="m-0 text-[9px] uppercase tracking-[0.28em] text-black/45 md:text-[10px]">
                    {modulePanel.eyebrow}
                  </p>
                  <div className="grid gap-2">
                    <h3 className="m-0 text-lg font-semibold tracking-[-0.05em] md:text-xl">
                      {modulePanel.title}
                    </h3>
                    <p className="m-0 max-w-[20ch] text-sm leading-6 text-black/65">
                      {modulePanel.text}
                    </p>
                  </div>
                </div>
                <div className="module-panel-final absolute inset-0 flex flex-col justify-between bg-black p-4 text-white md:p-5">
                  <p className="m-0 text-[9px] uppercase tracking-[0.28em] text-white/48 md:text-[10px]">
                    {compactModulePanel.eyebrow}
                  </p>
                  <div className="grid gap-1">
                    <h3 className="m-0 text-sm font-semibold tracking-[-0.05em] text-white md:text-base">
                      {compactModulePanel.title}
                    </h3>
                    <p className="m-0 max-w-[12ch] text-[11px] leading-5 text-white/64 md:text-xs">
                      {compactModulePanel.text}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 z-[5]">
                <div className="headline-block absolute top-1/2 right-4 w-[min(calc(100vw-1.5rem),44rem)] -translate-y-1/2 overflow-visible mix-blend-screen sm:right-5 sm:w-[min(calc(100vw-2.5rem),50rem)] md:right-[3.2vw] md:w-[min(calc(100vw-4rem),56rem)] lg:w-[min(calc(100vw-6rem),62rem)]">
                  {ARCHVIZ_HEADLINE.map((line, lineIndex) => (
                    <div key={line} className={lineIndex === 0 ? "overflow-hidden" : "mt-2 overflow-hidden"}>
                      <div
                        className={[
                          "flex flex-nowrap justify-start gap-x-[0.02em] whitespace-nowrap text-white",
                          lineIndex === 0
                            ? "text-[clamp(2rem,5vw,5.3rem)] font-semibold uppercase leading-[0.92] tracking-[-0.065em] md:text-[clamp(2.4rem,4.7vw,5.85rem)]"
                            : "text-[clamp(1.7rem,4.3vw,4.5rem)] font-semibold uppercase leading-[0.94] tracking-[-0.06em] md:text-[clamp(2rem,4vw,4.95rem)]",
                        ].join(" ")}
                      >
                        {Array.from(line).map((character, charIndex) => (
                          <span
                            key={`${line}-${charIndex}`}
                            className="headline-char inline-block whitespace-pre"
                          >
                            {character}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="post-global-headline absolute top-1/2 left-4 w-[min(calc(100vw-1.5rem),44rem)] -translate-y-1/2 overflow-visible sm:left-5 sm:w-[min(calc(100vw-2.5rem),50rem)] md:left-[3.2vw] md:w-[min(calc(100vw-4rem),56rem)] lg:w-[min(calc(100vw-6rem),62rem)]">
                  {POST_SKYLINE_HEADLINE.map((line, lineIndex) => (
                    <div key={line} className={lineIndex === 0 ? "overflow-hidden" : "mt-2 overflow-hidden"}>
                      <div
                        className={[
                          "flex flex-nowrap justify-start gap-x-[0.02em] whitespace-nowrap text-black",
                          lineIndex === 0
                            ? "text-[clamp(2rem,5vw,5.3rem)] font-semibold uppercase leading-[0.92] tracking-[-0.065em] md:text-[clamp(2.4rem,4.7vw,5.85rem)]"
                            : "text-[clamp(1.7rem,4.3vw,4.5rem)] font-semibold uppercase leading-[0.94] tracking-[-0.06em] md:text-[clamp(2rem,4vw,4.95rem)]",
                        ].join(" ")}
                      >
                        {Array.from(line).map((character, charIndex) => (
                          <span
                            key={`${line}-${charIndex}`}
                            className="post-global-headline-char inline-block whitespace-pre"
                          >
                            {character}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute right-4 bottom-6 w-[min(calc(100vw-2rem),34rem)] overflow-hidden sm:right-5 sm:bottom-8 sm:w-[min(calc(100vw-3rem),36rem)] md:right-[3.2vw] md:bottom-[3.4vw] md:w-[min(32vw,38rem)]">
                  <p className="post-global-paragraph max-w-[42ch] text-[15px] font-semibold leading-[1.45] tracking-[-0.02em] text-black/78 md:text-[30px] md:leading-[1.5]">
                    {POST_SKYLINE_PARAGRAPH}
                  </p>
                </div>
              </div>

              {TEXT_CARDS.map((card, index) => (
                <div
                  key={card.title}
                  className="info-card absolute overflow-hidden"
                  style={{
                    left: `${(card.col / NO_OF_COLUMNS) * 100}%`,
                    top: `${(card.row / NO_OF_ROWS) * 100}%`,
                    width: `${(card.colSpan / NO_OF_COLUMNS) * 100}%`,
                    height: `${(card.rowSpan / NO_OF_ROWS) * 100}%`,
                  }}
                >
                  <div className="card-reveal absolute inset-0 bg-black" />

                  <div className="card-content absolute inset-0 bg-black/92 p-8 text-white opacity-0 backdrop-blur-[2px]">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-5 text-3xl font-light tracking-[-0.04em]">
                      {card.title}
                    </h3>

                    <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                      {card.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
