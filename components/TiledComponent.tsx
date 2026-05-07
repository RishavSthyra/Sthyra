"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Open_Sans } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
});

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

type ApartmentBox = {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  variant: "light" | "dark";
  titleLines: string[];
  descriptionLines?: string[];
  showPlus?: boolean;
};

const TEXT_CARDS = [
  {
    row: 1,
    col: 2,
    rowSpan: 1,
    colSpan: 2,
    title: "Purpose",
    text: "Turn unbuilt spaces into clear, believable, and emotionally powerful experiences.",
  },
  {
    row: 1,
    col: 5,
    rowSpan: 1,
    colSpan: 2,
    title: "Audience",
    text: "Real estate developers, architects, sales teams, investors, and luxury property brands.",
  },
  {
    row: 2,
    col: 6,
    rowSpan: 1,
    colSpan: 2,
    title: "Outcome",
    text: "More clarity, stronger trust, faster decisions, and a premium project perception.",
  },
];

const INTRO_HEADLINE = [
  "We bridge the gap between blueprint",
  "and reality.",
];

const FEATURE_TILE = {
  row: 1,
  col: 1,
};

const ARCHVIZ_HEADLINE = [
  "FRICTION EXISTS IN",
  "THE IMAGINATION",
];

const POST_SKYLINE_HEADLINE = [
  "SCULPTING 3D",
  "INTO LIVED SPACES",
];

const POST_SKYLINE_PARAGRAPH =
  "Sthyra creates premium architectural visualization and 3D rendering for homes, interiors, and real estate, turning design ideas into cinematic, market-ready spatial stories.";

const POST_SKYLINE_HEADLINE_PANEL = {
  row: 1,
  col: 0,
  rowSpan: 2,
  colSpan: 2,
};

const POST_SKYLINE_PARAGRAPH_PANEL = {
  row: 3,
  col: 6,
  rowSpan: 1,
  colSpan: 2,
  cta: "SHOW MORE ++",
};

const POST_SKYLINE_TILES: PostSkylineTileConfig[] = [
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
];

const APARTMENT_BOXES: ApartmentBox[] = [
  {
    row: 0,
    col: 0,
    rowSpan: 1,
    colSpan: 2,
    variant: "dark",
    titleLines: [],
  },
  {
    row: 0,
    col: 2,
    rowSpan: 1,
    colSpan: 3,
    variant: "light",
    titleLines: ["INTERACTIVE", "WEB EXPERIENCES"],
    descriptionLines: [
      "Browser-based immersion designed for modern buyers, investors, and sales teams.",
      "These experiences can include interactive masterplans, tower selectors, apartment highlights, amenities, cinematic transitions, hotspots, and project storytelling.",
    ],
    showPlus: true,
  },
  {
    row: 1,
    col: 0,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    titleLines: ["CINEMATIC", "FILMS"],
    descriptionLines: [
      "High-emotion visual storytelling crafted to make unbuilt spaces feel desirable and real.",
      "These films are designed for launches, presentations, social campaigns, investor meetings, and premium website hero sections.",
    ],
    showPlus: true,
  },
  {
    row: 1,
    col: 3,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    titleLines: ["ULTRA-REAL", "RENDERS"],
    descriptionLines: [
      "Photorealistic imagery that removes doubt and elevates perceived project value.",
      "Every material, reflection, shadow, landscape layer, and atmosphere is shaped to feel believable.",
    ],
    showPlus: true,
  },
  {
    row: 1,
    col: 6,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    titleLines: ["PIXEL", "STREAMING"],
    descriptionLines: [
      "Unreal Engine quality delivered through the cloud without requiring powerful local devices.",
      "This allows premium interactive experiences to run through a browser.",
    ],
    showPlus: true,
  },
  {
    row: 3,
    col: 5,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    titleLines: ["VR & AR", "IMMERSION"],
    descriptionLines: [
      "Immersive pre-construction sales tools that help buyers understand space, scale, views, amenities, interiors, and lifestyle before the project exists physically.",
    ],
    showPlus: true,
  },
  {
    row: 3,
    col: 7,
    rowSpan: 1,
    colSpan: 1,
    variant: "dark",
    titleLines: ["LET'S", "WORK ++"],
  },
];

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

function getApartmentTileDelay(row: number, col: number, rows: number, columns: number) {
  const bottomBias = (rows - 1 - row) * 0.08;
  const centerDrift = Math.abs(col - (columns - 1) / 2) * 0.018;
  const variance = ((((row + 2) * 17 + (col + 3) * 11) % 5) + 1) * 0.018;

  return bottomBias + centerDrift + variance;
}

function getApartmentBoxTitleClass(box: ApartmentBox) {
  if (box.variant === "dark") {
    return "text-[clamp(0.76rem,0.9vw,0.98rem)]";
  }

  if (box.colSpan >= 3) {
    return "text-[clamp(0.96rem,1.45vw,1.72rem)]";
  }

  return "text-[clamp(0.9rem,1.18vw,1.32rem)]";
}

function getApartmentBoxDescriptionClass(box: ApartmentBox) {
  if (box.colSpan >= 3) {
    return "text-[clamp(0.94rem,1.05vw,1.12rem)] leading-[1.58]";
  }

  return "text-[clamp(0.88rem,0.96vw,1.02rem)] leading-[1.58]";
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
  const apartmentBoxPadding = "max(14px, calc(22px * var(--sthyra-compact-scale)))";
  const apartmentPlusOffset = "max(12px, calc(18px * var(--sthyra-compact-scale)))";
  const apartmentEdgePadding =
    "max(var(--sthyra-safe-gutter), 18px, calc(30px * var(--sthyra-compact-scale)))";
  const apartmentEdgePlusOffset =
    "max(var(--sthyra-safe-gutter), 12px, calc(18px * var(--sthyra-compact-scale)))";
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
    const introOffset = 2.7;
    const at = (time: number) => time + introOffset;
    const postSkylineReadHold = at(8.78);
    const apartmentSequenceStart = at(9.02);
    const apartmentBoxesStart = apartmentSequenceStart + 3.18;
    const apartmentReadHold = apartmentBoxesStart + 1.18;

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
      gsap.set(".apartment-sequence", {
        opacity: 0,
      });
      gsap.set(".apartment-sequence-tile", {
        opacity: 0,
        yPercent: 112,
        filter: "brightness(0.96) saturate(0.95)",
      });
      gsap.set(".apartment-sequence-box", {
        opacity: 0,
        y: 56,
        scale: 0.96,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(".apartment-sequence-box-copy", {
        opacity: 0,
        y: 18,
      });
      gsap.set(".headline-block", {
        opacity: 0,
        x: 0,
      });
      gsap.set(".headline-char", {
        yPercent: 0,
        opacity: 1,
      });
      gsap.set(".intro-copy", {
        opacity: 0,
      });
      gsap.set(".intro-copy-panel", {
        opacity: 0,
        scale: 0.985,
        y: 18,
      });
      gsap.set(".intro-line-char", {
        opacity: 0,
        yPercent: 120,
        filter: "blur(10px)",
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
          end: "+=10400",
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

      tl.to(
        ".intro-copy",
        {
          opacity: 1,
          duration: 0.18,
          ease: "none",
        },
        0.12,
      );

      tl.to(
        ".intro-copy-panel",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "power2.out",
        },
        0.16,
      );

      tl.to(
        ".intro-line-char",
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1.22,
          stagger: 0.032,
          ease: "power3.out",
        },
        0.24,
      );

      tl.to(
        ".intro-copy-panel",
        {
          y: -12,
          duration: 2.05,
          ease: "sine.inOut",
        },
        0.46,
      );

      tl.to(
        ".intro-line-char",
        {
          opacity: 0,
          yPercent: -42,
          filter: "blur(8px)",
          duration: 0.72,
          stagger: 0.02,
          ease: "power2.in",
        },
        2.18,
      );

      tl.to(
        ".intro-copy-panel",
        {
          opacity: 0,
          y: -24,
          scale: 1.015,
          duration: 0.42,
          ease: "power2.inOut",
        },
        2.42,
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
        at(0.25),
      );

      tl.to(
        ".card-content",
        {
          opacity: 1,
          duration: 0.34,
          stagger: 0.18,
        },
        at(0.92),
      );

      tl.to(
        ".card-reveal",
        {
          xPercent: 105,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.inOut",
        },
        at(1.28),
      );

      tl.to(
        ".card-content, .info-card",
        {
          opacity: 0,
          duration: 0.48,
          stagger: 0.08,
          ease: "power2.out",
        },
        at(3),
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
          at(1.06) + delay,
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
        at(1.34),
      );

      tl.to(
        ".feature-tile",
        {
          opacity: 0,
          duration: 0.42,
          ease: "power2.inOut",
        },
        at(2.02),
      );

      tl.to(
        ".skyline-feature-tile",
        {
          opacity: 1,
          scale: 1,
          duration: 0.52,
          ease: "power2.inOut",
        },
        at(2.02),
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
        at(2.34),
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
        at(2.34),
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
          at(2.58),
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
          at(2.84),
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
        at(3.28),
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
          at(3.8) + delay,
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
        at(4.26),
      );

      if (headlineBlock) {
        tl.to(
          headlineBlock,
          {
            opacity: 0,
            duration: 0.24,
            ease: "none",
          },
          at(4.54),
        );
      }

      tl.to(
        ".module-panel-primary",
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        at(4.4),
      );

      tl.to(
        ".module-panel",
        {
          left: `${((NO_OF_COLUMNS - 1) / NO_OF_COLUMNS) * 100}%`,
          width: `${(1 / NO_OF_COLUMNS) * 100}%`,
          duration: 0.72,
          ease: "power3.inOut",
        },
        at(4.48),
      );

      tl.to(
        ".module-panel-final",
        {
          opacity: 1,
          duration: 0.36,
          ease: "power2.out",
        },
        at(4.84),
      );

      tl.to(
        ".tile-shell",
        {
          backgroundColor: "#000000",
          ease: "none",
        },
        at(1.08),
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
          at(5.24) + delay,
        );
      });

      tl.to(
        ".module-panel",
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        at(5.12),
      );

      tl.to(
        ".tile-shell",
        {
          backgroundColor: "#ffffff",
          duration: 0.82,
          ease: "power2.inOut",
        },
        at(5.14),
      );

      tl.to(
        ".non-feature-panel",
        {
          backgroundColor: "#ffffff",
          borderColor: "rgba(0,0,0,0.08)",
          duration: 0.82,
          ease: "power2.inOut",
        },
        at(5.14),
      );

      tl.to(
        ".skyline-tile",
        {
          opacity: 0,
          duration: 0.82,
          ease: "power2.inOut",
        },
        at(5.26),
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
        at(5.58),
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
        at(5.66),
      );

      tl.to(
        ".post-global-headline",
        {
          opacity: 1,
          duration: 0.22,
          ease: "none",
        },
        at(5.58),
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
        at(5.62),
      );

      tl.to(
        ".post-global-paragraph",
        {
          opacity: 1,
          x: 0,
          duration: 0.54,
          ease: "power2.out",
        },
        at(5.94),
      );

      tl.to(
        {},
        {
          duration: 1.7,
        },
        postSkylineReadHold,
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
        at(5.66),
      );

      tl.to(
        ".post-global-headline, .post-global-paragraph",
        {
          opacity: 0,
          duration: 0.28,
          ease: "power2.out",
        },
        apartmentSequenceStart,
      );

      tl.to(
        ".post-skyline-image-frame",
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        apartmentSequenceStart + 0.06,
      );

      tl.to(
        ".apartment-sequence",
        {
          opacity: 1,
          duration: 0.14,
          ease: "none",
        },
        apartmentSequenceStart + 0.08,
      );

      tl.to(
        ".apartment-sequence-tile",
        {
          opacity: 1,
          yPercent: 0,
          filter: "brightness(1) saturate(1)",
          duration: 0.82,
          stagger: (index, target) =>
            Number((target as HTMLElement).dataset.apartmentDelay ?? 0),
          ease: "power3.out",
        },
        apartmentSequenceStart + 0.14,
      );

      tl.to(
        ".post-skyline-panel, .module-panel",
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        apartmentSequenceStart + 0.16,
      );

      tl.to(
        {},
        {
          duration: 2,
        },
        apartmentSequenceStart + 1.18,
      );

      tl.to(
        ".apartment-sequence-box",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.7,
          stagger: {
            amount: 0.32,
            from: "center",
          },
          ease: "power4.out",
        },
        apartmentBoxesStart,
      );

      tl.to(
        ".apartment-sequence-box-copy",
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.05,
          ease: "power2.out",
        },
        apartmentBoxesStart + 0.14,
      );

      tl.to(
        {},
        {
          duration: 1.9,
        },
        apartmentReadHold,
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [NO_OF_COLUMNS, NO_OF_ROWS]);

  const imageAspect = imageWidth / imageHeight;
  const viewportAspect =
    viewport.width > 0 && viewport.height > 0
      ? viewport.width / viewport.height
      : imageAspect;

  const frameWidth =
    viewportAspect < imageAspect
      ? viewport.width
      : viewport.height * imageAspect;
  const frameHeight =
    viewportAspect < imageAspect
      ? viewport.width / imageAspect
      : viewport.height;
  const offsetX = (viewport.width - frameWidth) / 2;
  const offsetY = (viewport.height - frameHeight) / 2;
  const gridFrameStyle = {
    left: `${offsetX}px`,
    top: `${offsetY}px`,
    width: `${frameWidth}px`,
    height: `${frameHeight}px`,
  };
  const apartmentFrameStyle = {
    inset: "0px",
  };

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
              style={gridFrameStyle}
            >
              <div className="intro-copy pointer-events-none absolute inset-0 z-[7] flex items-center justify-center px-6">
                <div className="intro-copy-panel relative flex max-w-[min(96vw,86vw)] flex-col items-center justify-center overflow-hidden px-6 py-8 text-center text-white md:px-10">
                  <div
                    className="absolute inset-0 rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.12),transparent_56%),linear-gradient(180deg,rgba(8,8,8,0.18),rgba(8,8,8,0.02))] opacity-70"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-x-[12%] top-[14%] h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="relative z-[1] flex flex-col gap-1 md:gap-2">
                    {INTRO_HEADLINE.map((line, lineIndex) => (
                      <div
                        key={line}
                        className={[
                          "overflow-hidden text-balance",
                          lineIndex === 0
                            ? "text-[clamp(3rem,7vw,6.9rem)]"
                            : "text-[clamp(3rem,7vw,6.9rem)]",
                        ].join(" ")}
                      >
                        <p
                          className={`${openSans.className} m-0 font-extralight leading-[0.94] tracking-[0.006em] text-white [text-shadow:0_12px_36px_rgba(0,0,0,0.34)]`}
                          aria-label={line}
                        >
                          {Array.from(line).map((character, charIndex) => (
                            <span
                              key={`${line}-${charIndex}`}
                              className="intro-line-char font-light inline-block whitespace-pre"
                              aria-hidden="true"
                            >
                              {character}
                            </span>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {Array.from({ length: NO_OF_ROWS }).map((_, row) =>
                Array.from({ length: NO_OF_COLUMNS }).map((_, col) => {
                  const featureTile = isFeatureTile(row, col);
                  const featureColumnTile = isFeatureColumnTile(row, col);
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
                  </div>
                  );
                }),
              )}
            </div>
            <div className="absolute" style={gridFrameStyle}>
              {POST_SKYLINE_TILES.map((tile) => {
                const postSkylineIsImage = tile.mode === "image";

                return (
                  <div
                    key={`post-skyline-${tile.row}-${tile.col}`}
                    className="post-skyline-panel absolute z-[4] overflow-hidden bg-white text-black"
                    data-post-delay={getPostSkylineDelay(tile.row, tile.col).toFixed(3)}
                    style={{
                      left: `${(tile.col / NO_OF_COLUMNS) * 100}%`,
                      top: `${(tile.row / NO_OF_ROWS) * 100}%`,
                      width: `${100 / NO_OF_COLUMNS}%`,
                      height: `${100 / NO_OF_ROWS}%`,
                    }}
                  >
                    {tile.label || tile.title ? (
                      <div
                        className={[
                          "post-skyline-copy absolute inset-0 flex flex-col",
                          tile.align === "end"
                            ? "items-end justify-end p-2 text-right md:p-3"
                            : tile.title
                              ? "items-start justify-center p-3 text-left md:p-4"
                              : "items-start justify-start p-3 text-left md:p-4",
                        ].join(" ")}
                      >
                        {tile.label ? (
                          <p className="m-0 text-[9px] font-semibold uppercase leading-none tracking-[-0.03em] md:text-[10px]">
                            {tile.label}
                          </p>
                        ) : null}
                        {tile.title ? (
                          <h3 className="m-0 max-w-[6ch] text-[clamp(1.75rem,2vw,2.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.06em]">
                            {tile.title}
                          </h3>
                        ) : null}
                      </div>
                    ) : null}
                    {postSkylineIsImage && tile.imageSrc ? (
                      <div className="post-skyline-image-frame absolute inset-0 overflow-hidden">
                        <Image
                          src={tile.imageSrc}
                          alt={tile.imageAlt ?? ""}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 50vw, 16vw"
                          className="post-skyline-image object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}

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
                <div
                  className="headline-block absolute top-1/2 w-[min(calc(100vw-1.5rem),44rem)] -translate-y-1/2 overflow-visible mix-blend-screen sm:w-[min(calc(100vw-2.5rem),50rem)] md:w-[min(calc(100vw-4rem),56rem)] lg:w-[min(calc(100vw-6rem),62rem)]"
                  style={{ right: "var(--sthyra-safe-gutter)" }}
                >
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
                <div
                  className="post-global-headline post-skyline-panel absolute overflow-hidden bg-white text-black"
                  data-post-delay={getPostSkylineDelay(
                    POST_SKYLINE_HEADLINE_PANEL.row,
                    POST_SKYLINE_HEADLINE_PANEL.col,
                  ).toFixed(3)}
                  style={{
                    left: `${(POST_SKYLINE_HEADLINE_PANEL.col / NO_OF_COLUMNS) * 100}%`,
                    top: `${(POST_SKYLINE_HEADLINE_PANEL.row / NO_OF_ROWS) * 100}%`,
                    width: `${(POST_SKYLINE_HEADLINE_PANEL.colSpan / NO_OF_COLUMNS) * 100}%`,
                    height: `${(POST_SKYLINE_HEADLINE_PANEL.rowSpan / NO_OF_ROWS) * 100}%`,
                  }}
                >
                  <div
                    className="flex h-full flex-col justify-center"
                    style={{
                      paddingTop: "max(18px, calc(22px * var(--sthyra-compact-scale)))",
                      paddingRight: "max(18px, calc(22px * var(--sthyra-compact-scale)))",
                      paddingBottom: "max(18px, calc(22px * var(--sthyra-compact-scale)))",
                      paddingLeft:
                        "max(var(--sthyra-safe-gutter), 18px, calc(22px * var(--sthyra-compact-scale)))",
                    }}
                  >
                    {POST_SKYLINE_HEADLINE.map((line, lineIndex) => (
                      <div key={line} className={lineIndex === 0 ? "overflow-hidden" : "mt-2 overflow-hidden"}>
                        <div
                          className={[
                            "flex flex-nowrap justify-start gap-x-[0.02em] whitespace-nowrap text-black",
                            lineIndex === 0
                              ? "text-[clamp(1.55rem,2.35vw,3.35rem)] font-semibold uppercase leading-[0.92] tracking-[-0.06em]"
                              : "text-[clamp(1.45rem,2.15vw,3.1rem)] font-semibold uppercase leading-[0.94] tracking-[-0.055em]",
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
                </div>
                <div
                  className="post-skyline-panel pointer-events-none absolute overflow-hidden bg-white text-black"
                  data-post-delay={getPostSkylineDelay(
                    POST_SKYLINE_PARAGRAPH_PANEL.row,
                    POST_SKYLINE_PARAGRAPH_PANEL.col,
                  ).toFixed(3)}
                  style={{
                    left: `${(POST_SKYLINE_PARAGRAPH_PANEL.col / NO_OF_COLUMNS) * 100}%`,
                    top: `${(POST_SKYLINE_PARAGRAPH_PANEL.row / NO_OF_ROWS) * 100}%`,
                    width: `${(POST_SKYLINE_PARAGRAPH_PANEL.colSpan / NO_OF_COLUMNS) * 100}%`,
                    height: `${(POST_SKYLINE_PARAGRAPH_PANEL.rowSpan / NO_OF_ROWS) * 100}%`,
                  }}
                >
                  <div
                    className="post-global-paragraph flex h-full flex-col justify-between"
                    style={{
                      paddingTop: "max(16px, calc(20px * var(--sthyra-compact-scale)))",
                      paddingRight:
                        "max(var(--sthyra-safe-gutter), 16px, calc(20px * var(--sthyra-compact-scale)))",
                      paddingBottom: "max(14px, calc(18px * var(--sthyra-compact-scale)))",
                      paddingLeft: "max(16px, calc(20px * var(--sthyra-compact-scale)))",
                    }}
                  >
                    <p className="m-0 max-w-[26ch] text-[clamp(0.95rem,1.15vw,1.35rem)] font-semibold leading-[1.45] tracking-[-0.02em] text-black/78">
                      {POST_SKYLINE_PARAGRAPH}
                    </p>
                    <p className="m-0 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-black">
                      {POST_SKYLINE_PARAGRAPH_PANEL.cta}
                    </p>
                  </div>
                </div>
              </div>

              <div className="apartment-sequence pointer-events-none absolute inset-0 z-[6]">
                <div className="absolute" style={apartmentFrameStyle}>
                  {Array.from({ length: NO_OF_ROWS }).map((_, row) =>
                    Array.from({ length: NO_OF_COLUMNS }).map((_, col) => (
                      <div
                        key={`apartment-sequence-${row}-${col}`}
                        className="absolute overflow-hidden"
                        style={{
                          left: `${(col / NO_OF_COLUMNS) * 100}%`,
                          top: `${(row / NO_OF_ROWS) * 100}%`,
                          width: `${100 / NO_OF_COLUMNS}%`,
                          height: `${100 / NO_OF_ROWS}%`,
                        }}
                      >
                        <Image
                          src={`/apartmentno2/tile_${row}_${col}.jpg`}
                          alt=""
                          width={TILE_WIDTH}
                          height={TILE_HEIGHT}
                          unoptimized
                          data-apartment-delay={getApartmentTileDelay(
                            row,
                            col,
                            NO_OF_ROWS,
                            NO_OF_COLUMNS,
                          ).toFixed(3)}
                          className="apartment-sequence-tile absolute inset-0 h-full w-full object-fill"
                        />
                      </div>
                    )),
                  )}
                </div>

                <div className="absolute" style={apartmentFrameStyle}>
                  {APARTMENT_BOXES.map((box, index) => (
                    <div
                      key={`${box.titleLines.join("-")}-${index}`}
                      className={[
                        "apartment-sequence-box group/service-card pointer-events-auto absolute overflow-hidden",
                        box.variant === "light" ? "bg-white text-black" : "bg-black text-white",
                      ].join(" ")}
                      style={{
                        left: `${(box.col / NO_OF_COLUMNS) * 100}%`,
                        top: `${(box.row / NO_OF_ROWS) * 100}%`,
                        width: `${(box.colSpan / NO_OF_COLUMNS) * 100}%`,
                        height: `${(box.rowSpan / NO_OF_ROWS) * 100}%`,
                      }}
                    >
                      <div
                        className="apartment-sequence-box-copy absolute inset-0 flex flex-col justify-between text-left"
                        style={{
                          paddingTop: apartmentBoxPadding,
                          paddingBottom: apartmentBoxPadding,
                          paddingLeft: box.col === 0 ? apartmentEdgePadding : apartmentBoxPadding,
                          paddingRight:
                            box.col + box.colSpan === NO_OF_COLUMNS
                              ? apartmentEdgePadding
                              : apartmentBoxPadding,
                        }}
                      >
                        {box.titleLines.length > 0 ? (
                          <div className="relative flex-1 overflow-hidden">
                            <div className="absolute inset-0 transition-all duration-400 ease-out group-hover/service-card:translate-y-[-10px] group-hover/service-card:opacity-0">
                              <div className="grid w-full gap-[0.02em]">
                                {box.titleLines.map((line) => (
                                  <h3
                                    key={line}
                                    className={[
                                      "m-0 font-semibold uppercase leading-[0.9] tracking-[-0.045em]",
                                      getApartmentBoxTitleClass(box),
                                    ].join(" ")}
                                  >
                                    {line}
                                  </h3>
                                ))}
                              </div>
                            </div>

                            {box.descriptionLines?.length ? (
                              <div className="absolute inset-0 translate-y-[12px] opacity-0 transition-all duration-400 ease-out group-hover/service-card:translate-y-0 group-hover/service-card:opacity-100">
                                <div className="grid w-full gap-3 text-black/72">
                                  {box.descriptionLines.map((line) => (
                                    <p
                                      key={line}
                                      className={[
                                        "m-0 max-w-full tracking-[-0.012em]",
                                        getApartmentBoxDescriptionClass(box),
                                      ].join(" ")}
                                    >
                                      {line}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <span aria-hidden="true" />
                        )}

                        {box.showPlus ? (
                          <div
                            className="absolute h-8 w-8 rotate-45 text-black/40 transition-transform duration-400 ease-out group-hover/service-card:rotate-90 md:h-10 md:w-10"
                            style={{
                              right:
                                box.col + box.colSpan === NO_OF_COLUMNS
                                  ? apartmentEdgePlusOffset
                                  : apartmentPlusOffset,
                              bottom: apartmentPlusOffset,
                            }}
                          >
                            <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                            <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {TEXT_CARDS.map((card) => (
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

                  <div className="card-content absolute inset-0 border border-white/10 bg-black/90 p-8 text-white opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-[4px] md:p-10">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-white/42">
                      {card.title}
                    </p>

                    <p className="mt-5 max-w-[22ch] text-[clamp(1.1rem,1.45vw,1.6rem)] leading-[1.45] tracking-[-0.035em] text-white/84">
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
