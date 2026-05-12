"use client";

import {
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Open_Sans } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectMapSection from "@/components/ProjectMapSection";
import TiledComponentMobile from "@/components/TiledComponentMobile";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
});

let scrollTriggerRegistered = false;

function registerScrollTrigger() {
  if (scrollTriggerRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
}

interface TILECOMBININGTYPES {
  BASEURL: string;
  SECONDARY_BASEURL?: string;
  NO_OF_ROWS: number;
  NO_OF_COLUMNS: number;
  TILE_HEIGHT: number;
  TILE_WIDTH: number;
}

const PROJECT_SITE_COORDINATES: [number, number] = [77.5946, 12.9716];

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
  id: string;
  href?: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  variant: "light" | "dark";
  titleLines: string[];
  descriptionLines?: string[];
  tileBaseUrl?: string;
  tileFilePrefix?: string;
  showPlus?: boolean;
};

type HoverableApartmentBox = ApartmentBox & {
  tileBaseUrl: string;
};

type ReasonCard = {
  kind: "reason";
  id: string;
  navIndex: number;
  number: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  align: "left" | "right";
  centerText?: string;
};

type ReasonCenterScene = {
  kind: "center";
  id: string;
  navIndex: number;
  label: string;
  title: string;
  text: string;
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

const REASON_CARDS: ReasonCard[] = [
  {
    kind: "reason",
    id: "reason-01",
    navIndex: 0,
    number: "Reason 01",
    title: "Sell Before You Build",
    body: "Even before construction, this already feels real. Validate the market with photorealism, immersive walkthroughs, and interactive sales journeys.",
    imageSrc: "/reasons/Reason 1.jpg",
    imageAlt: "Architectural immersion showing a premium residence before construction",
    align: "right",
    centerText: "A clearer way to sell what has not yet been built.",
  },
  {
    kind: "reason",
    id: "reason-02",
    navIndex: 1,
    number: "Reason 02",
    title: "Eliminate Confusion",
    body: "No imagination required. Everything is clear. No visual noise, no technical overload, just pure clarity.",
    imageSrc: "/reasons/Reason 2.jpg",
    imageAlt: "Architectural visualization that makes a proposed space immediately understandable",
    align: "left",
  },
  {
    kind: "reason",
    id: "reason-03",
    navIndex: 2,
    number: "Reason 03",
    title: "Faster Decisions",
    body: "When people feel the space, they decide faster. Confidence drives stronger buyer action and smoother sales conversations.",
    imageSrc: "/reasons/Reason 3.jpg",
    imageAlt: "Immersive architectural image designed to accelerate buyer confidence",
    align: "right",
    centerText: "Feel the space. Move the decision.",
  },
  {
    kind: "reason",
    id: "reason-04",
    navIndex: 3,
    number: "Reason 04",
    title: "Premium Brand",
    body: "This looks a tier above. Position your project as timeless, confident, premium, and future-facing.",
    imageSrc: "/reasons/Reason 4.jpg",
    imageAlt: "Premium architectural presentation image for a future-facing project",
    align: "left",
  },
  {
    kind: "reason",
    id: "reason-05",
    navIndex: 4,
    number: "Reason 05",
    title: "Stronger Sales Conversations",
    body: "Your sales team gets a powerful visual tool that makes explanation easier, faster, and more persuasive.",
    imageSrc: "/reasons/Reason 5.jpg",
    imageAlt: "Visual sales tool for premium pre-construction real estate storytelling",
    align: "right",
  },
  {
    kind: "reason",
    id: "reason-06",
    navIndex: 5,
    number: "Reason 06",
    title: "Better Stakeholder Alignment",
    body: "Developers, architects, investors, and buyers can align around one clear visual experience instead of fragmented references.",
    imageSrc: "/reasons/Reason 6.jpg",
    imageAlt: "Architectural immersion aligning developers, investors, and buyers around one vision",
    align: "left",
    centerText: "One visual truth for everyone in the room.",
  },
];

const REASON_SCENES: Array<ReasonCard | ReasonCenterScene> = [
  REASON_CARDS[0],
  REASON_CARDS[1],
  {
    kind: "center",
    id: "reason-center-01",
    navIndex: 1,
    label: "STHYRA Architectural Immersion",
    title: "Clarity becomes the sales environment.",
    text: "As the visuals take over the screen, the project stops feeling conceptual and starts feeling inevitable.",
  },
  REASON_CARDS[2],
  REASON_CARDS[3],
  {
    kind: "center",
    id: "reason-center-02",
    navIndex: 3,
    label: "Sales Story",
    title: "A scroll-led immersion for buyers, stakeholders, and teams.",
    text: "One cohesive visual system aligns developers, architects, investors, and customers around the same future.",
  },
  REASON_CARDS[4],
  REASON_CARDS[5],
];

const FOOTER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "Reasons", href: "#reasons" },
  { label: "Contact", href: "#contact" },
];

const FOOTER_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

const FOOTER_POLICY_LINKS = ["Privacy policy", "Terms & conditions"];

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
  {
    row: 0,
    col: 2,
    mode: "image",
    imageSrc:
      "https://cdn.sthyra.com/sthyra-labs/Images/hf_20260507_102235_b69ea62f-63ce-42d0-9b85-0fe7870d5c4e.jpg",
    imageAlt: "Luxury stone interior corridor",
  },
  {
    row: 3,
    col: 3,
    mode: "image",
    imageSrc:
      "https://cdn.sthyra.com/sthyra-labs/Images/hf_20260508_043934_d5a4a4f1-1642-4244-9566-9709780d939e.jpg",
    imageAlt: "Luxury stone interior corridor",
  },
];

const APARTMENT_BOXES: ApartmentBox[] = [
  {
    id: "empty-anchor",
    row: 0,
    col: 0,
    rowSpan: 1,
    colSpan: 2,
    variant: "dark",
    titleLines: [],
  },
  {
    id: "interactive-web-experiences",
    href: "/services/interactive-real-estate-web-experiences",
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
    tileBaseUrl: "/web_tiles_4x8",
    tileFilePrefix: "web_tile",
    showPlus: true,
  },
  {
    id: "cinematic-films",
    href: "/services/cinematic-real-estate-films",
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
    tileBaseUrl: "/cinematic_tiles_4x8",
    tileFilePrefix: "cinematic_tile",
    showPlus: true,
  },
  {
    id: "ultra-real-renders",
    href: "/services/ultra-real-real-estate-renders",
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
    tileBaseUrl: "/unreal_tiles_4x8",
    tileFilePrefix: "unreal_tile",
    showPlus: true,
  },
  {
    id: "pixel-streaming",
    href: "/services/real-estate-digital-twins",
    row: 1,
    col: 6,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    titleLines: ["DIGITAL", "TWINS"],
    descriptionLines: [
      "A living digital replica of your project, designed to make every tower, amenity, and spatial decision instantly understandable.",
      "It turns complex real estate plans into an interactive experience buyers, teams, and stakeholders can explore with confidence.",
    ],
    tileBaseUrl: "/pixelstreaming_tiles_4x8",
    tileFilePrefix: "pixelstreaming_tile",
    showPlus: true,
  },
  {
    id: "vr-ar-immersion",
    href: "/services/ar-vr-real-estate-experiences",
    row: 3,
    col: 5,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    titleLines: ["VR & AR", "IMMERSION"],
    descriptionLines: [
      "Immersive pre-construction sales tools that help buyers understand space, scale, views, amenities, interiors, and lifestyle before the project exists physically.",
    ],
    tileBaseUrl: "/vr_tiles_4x8",
    tileFilePrefix: "vr_tile",
    showPlus: true,
  },
  {
    id: "lets-work",
    row: 3,
    col: 7,
    rowSpan: 1,
    colSpan: 1,
    variant: "dark",
    titleLines: ["LET'S", "WORK ++"],
  },
];

const HOVERABLE_APARTMENT_BOXES = APARTMENT_BOXES.filter(
  (box): box is HoverableApartmentBox => Boolean(box.tileBaseUrl),
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

function getApartmentTileDelay(row: number, col: number, rows: number, columns: number) {
  const bottomBias = (rows - 1 - row) * 0.08;
  const centerDrift = Math.abs(col - (columns - 1) / 2) * 0.018;
  const variance = ((((row + 2) * 17 + (col + 3) * 11) % 5) + 1) * 0.018;

  return bottomBias + centerDrift + variance;
}

function buildTileImagePath(baseUrl: string, row: number, col: number, filePrefix = "tile") {
  return `${baseUrl}/${filePrefix}_${row}_${col}.jpg`;
}

function createIndexArray(length: number) {
  return Array.from({ length }, (_, index) => index);
}

function getTilePositionStyle(row: number, col: number, rows: number, columns: number): CSSProperties {
  const width = 100 / columns;
  const height = 100 / rows;

  return {
    left: `${(col / columns) * 100}%`,
    top: `${(row / rows) * 100}%`,
    width: `calc(${width}% + 0.5px)`,
    height: `calc(${height}% + 0.5px)`,
    transform: "translateZ(0)",
  };
}

function getSpanningTileStyle(
  row: number,
  col: number,
  rowSpan: number,
  colSpan: number,
  rows: number,
  columns: number,
): CSSProperties {
  return {
    left: `${(col / columns) * 100}%`,
    top: `${(row / rows) * 100}%`,
    width: `calc(${(colSpan / columns) * 100}% + 0.5px)`,
    height: `calc(${(rowSpan / rows) * 100}% + 0.5px)`,
    transform: "translateZ(0)",
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getApartmentBoxTitleClass(box: ApartmentBox) {
  if (box.variant === "dark") {
    return "text-[clamp(0.68rem,0.78vw,0.86rem)]";
  }

  if (box.colSpan >= 3) {
    return "text-[clamp(0.82rem,1.18vw,1.36rem)]";
  }

  return "text-[clamp(0.78rem,1vw,1.08rem)]";
}

function getApartmentBoxDescriptionClass(box: ApartmentBox) {
  if (box.colSpan >= 3) {
    return "text-[clamp(0.82rem,0.9vw,0.96rem)] leading-[1.58]";
  }

  return "text-[clamp(0.78rem,0.84vw,0.9rem)] leading-[1.58]";
}

function FooterWaveLabel({ label }: { label: string }) {
  const characters = Array.from(label);

  return (
    <span className="relative inline-flex overflow-hidden align-top">
      <span aria-hidden="true" className="inline-flex">
        {characters.map((character, index) => (
          <span
            key={`top-${label}-${index}`}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [will-change:transform] group-hover/footer-wave-link:-translate-y-[115%]"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>

      <span aria-hidden="true" className="absolute left-0 top-0 inline-flex">
        {characters.map((character, index) => (
          <span
            key={`bottom-${label}-${index}`}
            className="inline-block translate-y-[115%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [will-change:transform] group-hover/footer-wave-link:translate-y-0"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>

      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function CreateImageFromTiles({
  BASEURL,
  SECONDARY_BASEURL = "/SKYLINE_tiles_32",
  NO_OF_ROWS,
  NO_OF_COLUMNS,
  TILE_HEIGHT,
  TILE_WIDTH,
}: TILECOMBININGTYPES) {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const apartmentSequenceRef = useRef<HTMLDivElement | null>(null);
  const reasonsSectionRef = useRef<HTMLElement | null>(null);
  const hoverTileWaveRef = useRef<gsap.core.Tween | null>(null);
  const hoverTileClearRef = useRef<number | null>(null);
  const visibleHoverServiceIdRef = useRef<string | null>(null);
  const hoverPreloadStartedRef = useRef(false);
  const hoverPreloadTimerRef = useRef<number | null>(null);
  const hoverIdleCallbackRef = useRef<number | null>(null);
  const hoverAnimationFrameRef = useRef<number | null>(null);
  const viewportFrameRef = useRef<number | null>(null);
  const scrollRefreshFrameRef = useRef<number | null>(null);
  const mountedHoverServiceIdsRef = useRef(new Set<string>());
  const hoverTileCacheRef = useRef(new Map<string, HTMLElement[]>());
  const hoverOriginRef = useRef({ x: 0.5, y: 0.5 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [mountedHoverServiceIds, setMountedHoverServiceIds] = useState<string[]>([]);
  const hasValidGrid = NO_OF_ROWS > 0 && NO_OF_COLUMNS > 0;
  const rows = useMemo(() => (hasValidGrid ? createIndexArray(NO_OF_ROWS) : []), [NO_OF_ROWS, hasValidGrid]);
  const columns = useMemo(
    () => (hasValidGrid ? createIndexArray(NO_OF_COLUMNS) : []),
    [NO_OF_COLUMNS, hasValidGrid],
  );
  const tileGrid = useMemo(
    () =>
      rows.flatMap((row) =>
        columns.map((col) => ({
          row,
          col,
          key: `${row}_${col}`,
          style: getTilePositionStyle(row, col, NO_OF_ROWS, NO_OF_COLUMNS),
        })),
      ),
    [NO_OF_ROWS, NO_OF_COLUMNS, rows, columns],
  );
  const mountedHoverServiceIdSet = useMemo(
    () => new Set(mountedHoverServiceIds),
    [mountedHoverServiceIds],
  );
  const mountedHoverServices = useMemo(
    () => HOVERABLE_APARTMENT_BOXES.filter((box) => mountedHoverServiceIdSet.has(box.id)),
    [mountedHoverServiceIdSet],
  );
  const postSkylineTiles = useMemo(
    () =>
      POST_SKYLINE_TILES.map((tile) => ({
        ...tile,
        key: `post-skyline-${tile.row}-${tile.col}`,
        style: hasValidGrid
          ? getTilePositionStyle(tile.row, tile.col, NO_OF_ROWS, NO_OF_COLUMNS)
          : {},
        delay: getPostSkylineDelay(tile.row, tile.col).toFixed(3),
      })),
    [NO_OF_COLUMNS, NO_OF_ROWS, hasValidGrid],
  );
  const apartmentBoxes = useMemo(
    () =>
      APARTMENT_BOXES.map((box, index) => ({
        ...box,
        key: `${box.id}-${index}`,
        style: hasValidGrid
          ? getSpanningTileStyle(
            box.row,
            box.col,
            box.rowSpan,
            box.colSpan,
            NO_OF_ROWS,
            NO_OF_COLUMNS,
          )
          : {},
      })),
    [NO_OF_COLUMNS, NO_OF_ROWS, hasValidGrid],
  );
  const textCards = useMemo(
    () =>
      TEXT_CARDS.map((card) => ({
        ...card,
        style: hasValidGrid
          ? getSpanningTileStyle(
            card.row,
            card.col,
            card.rowSpan,
            card.colSpan,
            NO_OF_ROWS,
            NO_OF_COLUMNS,
          )
          : {},
      })),
    [NO_OF_COLUMNS, NO_OF_ROWS, hasValidGrid],
  );
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
  const hasViewport = viewport.width > 0 && viewport.height > 0;
  const useMobileTabletLayout = viewport.width > 0 && viewport.width < 1100;
  const isFeatureTile = (row: number, col: number) =>
    row === FEATURE_TILE.row && col === FEATURE_TILE.col;
  const isFeatureColumnTile = (row: number, col: number) =>
    col === FEATURE_TILE.col && row !== FEATURE_TILE.row;

  const getHoverTilesForService = useCallback((serviceId: string) => {
    const cached = hoverTileCacheRef.current.get(serviceId);

    if (cached) {
      return cached;
    }

    const sequence = apartmentSequenceRef.current;

    if (!sequence) {
      return [] as HTMLElement[];
    }

    const tiles = gsap.utils.toArray<HTMLElement>(
      sequence.querySelectorAll(`[data-hover-service="${serviceId}"]`),
    );

    hoverTileCacheRef.current.set(serviceId, tiles);
    return tiles;
  }, []);

  useLayoutEffect(() => {
    if (!apartmentSequenceRef.current) {
      return;
    }

    mountedHoverServices.forEach((service) => {
      hoverTileCacheRef.current.delete(service.id);
      getHoverTilesForService(service.id);
    });
  }, [getHoverTilesForService, mountedHoverServices]);

  const hideHoverTilesExcept = useCallback((serviceId: string | null) => {
    const tileGroups = Array.from(hoverTileCacheRef.current.entries());
    let tiles = tileGroups
      .filter(([id]) => id !== serviceId)
      .flatMap(([, groupTiles]) => groupTiles);

    if (tiles.length === 0) {
      const sequence = apartmentSequenceRef.current;

      if (!sequence) {
        return;
      }

      const selector = serviceId
        ? `.service-hover-tile:not([data-hover-service="${serviceId}"])`
        : ".service-hover-tile";
      tiles = gsap.utils.toArray<HTMLElement>(sequence.querySelectorAll(selector));
    }

    if (tiles.length === 0) {
      return;
    }

    gsap.killTweensOf(tiles);
    gsap.set(tiles, { opacity: 0 });
  }, []);

  const ensureHoverServiceMounted = useCallback((serviceId: string) => {
    if (mountedHoverServiceIdsRef.current.has(serviceId)) {
      return;
    }

    mountedHoverServiceIdsRef.current.add(serviceId);
    setMountedHoverServiceIds((current) =>
      current.includes(serviceId) ? current : [...current, serviceId],
    );
  }, []);

  const scheduleHoverServiceWarmup = useCallback(() => {
    if (hoverPreloadStartedRef.current) {
      return;
    }

    hoverPreloadStartedRef.current = true;

    let serviceIndex = 0;
    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    const warmNextService = () => {
      const nextService = HOVERABLE_APARTMENT_BOXES[serviceIndex];

      if (!nextService) {
        return;
      }

      ensureHoverServiceMounted(nextService.id);
      serviceIndex += 1;

      if (serviceIndex >= HOVERABLE_APARTMENT_BOXES.length) {
        return;
      }

      if (idleWindow.requestIdleCallback) {
        hoverIdleCallbackRef.current = idleWindow.requestIdleCallback(
          () => {
            warmNextService();
          },
          { timeout: 900 },
        );
        return;
      }

      hoverPreloadTimerRef.current = window.setTimeout(() => {
        warmNextService();
      }, 120);
    };

    warmNextService();
  }, [ensureHoverServiceMounted]);

  const animateHoverTiles = useCallback((mode: "in" | "out", serviceId: string) => {
    const tiles = getHoverTilesForService(serviceId);

    if (tiles.length === 0) {
      return;
    }

    gsap.killTweensOf(tiles);
    hoverTileWaveRef.current?.kill();

    hoverTileWaveRef.current = gsap.to(tiles, {
      opacity: mode === "in" ? 1 : 0,
      duration: mode === "in" ? 0.56 : 0.42,
      ease: mode === "in" ? "power2.out" : "power2.inOut",
      delay: (index, target) => {
        const element = target as HTMLElement;
        const row = Number(element.dataset.hoverRow ?? 0);
        const col = Number(element.dataset.hoverCol ?? 0);
        const originX = hoverOriginRef.current.x * Math.max(NO_OF_COLUMNS - 1, 1);
        const originY = hoverOriginRef.current.y * Math.max(NO_OF_ROWS - 1, 1);
        const distance = Math.hypot(col - originX, row - originY);

        return distance * 0.045;
      },
      overwrite: true,
    });
  }, [NO_OF_COLUMNS, NO_OF_ROWS, getHoverTilesForService]);

  const handleServiceHoverEnter = useCallback((
    box: ApartmentBox,
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!box.tileBaseUrl) {
      return;
    }

    ensureHoverServiceMounted(box.id);

    if (hoverTileClearRef.current !== null) {
      window.clearTimeout(hoverTileClearRef.current);
      hoverTileClearRef.current = null;
    }

    const bounds = apartmentSequenceRef.current?.getBoundingClientRect();

    if (bounds) {
      hoverOriginRef.current = {
        x: (event.clientX - bounds.left) / Math.max(bounds.width, 1),
        y: (event.clientY - bounds.top) / Math.max(bounds.height, 1),
      };
    }

    if (visibleHoverServiceIdRef.current !== box.id) {
      hideHoverTilesExcept(box.id);
      visibleHoverServiceIdRef.current = box.id;
    }

    setHoveredServiceId((current) => (current === box.id ? current : box.id));

    if (hoverAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(hoverAnimationFrameRef.current);
    }

    hoverAnimationFrameRef.current = window.requestAnimationFrame(() => {
      hoverAnimationFrameRef.current = window.requestAnimationFrame(() => {
        hoverAnimationFrameRef.current = null;
        animateHoverTiles("in", box.id);
      });
    });
  }, [animateHoverTiles, ensureHoverServiceMounted, hideHoverTilesExcept]);

  const handleServiceHoverLeave = useCallback((
    box: ApartmentBox,
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const nextTarget = event.relatedTarget as HTMLElement | null;

    if (nextTarget?.closest("[data-service-card='true']")) {
      return;
    }

    setHoveredServiceId((current) => (current === null ? current : null));

    if (!box.tileBaseUrl) {
      return;
    }

    animateHoverTiles("out", box.id);

    hoverTileClearRef.current = window.setTimeout(() => {
      if (visibleHoverServiceIdRef.current === box.id) {
        visibleHoverServiceIdRef.current = null;
      }

      hoverTileClearRef.current = null;
    }, 440);
  }, [animateHoverTiles]);

  const handleServiceCardActivate = useCallback((box: ApartmentBox) => {
    if (!box.href) {
      return;
    }

    router.push(box.href, { scroll: true });
  }, [router]);

  const handleServiceCardKeyDown = useCallback((
    box: ApartmentBox,
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (!box.href || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    handleServiceCardActivate(box);
  }, [handleServiceCardActivate]);

  useLayoutEffect(() => {
    const syncViewport = () => {
      if (viewportFrameRef.current !== null) {
        return;
      }

      viewportFrameRef.current = window.requestAnimationFrame(() => {
        viewportFrameRef.current = null;
        const nextViewport = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        setViewport((current) =>
          current.width === nextViewport.width && current.height === nextViewport.height
            ? current
            : nextViewport,
        );
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
      if (viewportFrameRef.current !== null) {
        window.cancelAnimationFrame(viewportFrameRef.current);
        viewportFrameRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!hasViewport) {
      return;
    }

    if (useMobileTabletLayout) {
      return;
    }

    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        scheduleHoverServiceWarmup();
        observer.disconnect();
      },
      {
        rootMargin: "160% 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();

      const idleWindow = window as Window & {
        cancelIdleCallback?: (handle: number) => void;
      };

      if (hoverIdleCallbackRef.current !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(hoverIdleCallbackRef.current);
        hoverIdleCallbackRef.current = null;
      }

      if (hoverPreloadTimerRef.current !== null) {
        window.clearTimeout(hoverPreloadTimerRef.current);
        hoverPreloadTimerRef.current = null;
      }
    };
  }, [scheduleHoverServiceWarmup, useMobileTabletLayout, hasViewport]);

  useLayoutEffect(() => {
    if (!hasViewport) {
      return;
    }

    if (useMobileTabletLayout) {
      return;
    }

    registerScrollTrigger();
    const introOffset = 2.7;
    const at = (time: number) => time + introOffset;
    const postSkylineReadHold = at(8.78);
    const apartmentSequenceStart = at(9.02);
    const apartmentBoxesStart = apartmentSequenceStart + 3.18;
    const apartmentReadHold = apartmentBoxesStart + 1.18;
    const hoverTileCache = hoverTileCacheRef.current;

    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const headlineBlock = stage?.querySelector<HTMLElement>(".headline-block") ?? null;
      const featureCell = stage?.querySelector<HTMLElement>(".feature-cell") ?? null;

      if (!stage) {
        return;
      }

      const tileMask = sectionRef.current?.querySelector<HTMLElement>(".tile-mask") ?? null;
      const tileMaskTargets = tileMask ? [tileMask] : [];
      const tileShell = stage.querySelector<HTMLElement>(".tile-shell");
      const tileShellTargets = tileShell ? [tileShell] : [];
      const tileImages = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".tile-image"));
      const featureTiles = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".feature-tile"));
      const nonFeaturePanels = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".non-feature-panel"),
      );
      const skylineExpansionTiles = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".skyline-expansion-tile"),
      );
      const skylineTiles = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".skyline-tile"));
      const skylineFeatureTiles = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".skyline-feature-tile"),
      );
      const skylineColumnTopTiles = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".skyline-column-top"),
      );
      const skylineColumnBottomTiles = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".skyline-column-bottom"),
      );
      const modulePanels = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".module-panel"));
      const modulePanelPrimary = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".module-panel-primary"),
      );
      const modulePanelFinal = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".module-panel-final"),
      );
      const postSkylinePanels = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-skyline-panel"),
      );
      const postSkylineCopy = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-skyline-copy"),
      );
      const postGlobalHeadline = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-global-headline"),
      );
      const postGlobalHeadlineChars = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-global-headline-char"),
      );
      const postGlobalParagraph = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-global-paragraph"),
      );
      const postSkylineImageFrames = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-skyline-image-frame"),
      );
      const postSkylineImages = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".post-skyline-image"),
      );
      const apartmentSequence = stage.querySelector<HTMLElement>(".apartment-sequence");
      const apartmentSequenceTargets = apartmentSequence ? [apartmentSequence] : [];
      const apartmentSequenceTiles = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".apartment-sequence-tile"),
      );
      const apartmentSequenceBoxes = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".apartment-sequence-box"),
      );
      const apartmentSequenceBoxCopy = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".apartment-sequence-box-copy"),
      );
      const headlineChars = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".headline-char"),
      );
      const introCopy = stage.querySelector<HTMLElement>(".intro-copy");
      const introCopyTargets = introCopy ? [introCopy] : [];
      const introCopyPanel = stage.querySelector<HTMLElement>(".intro-copy-panel");
      const introCopyPanelTargets = introCopyPanel ? [introCopyPanel] : [];
      const introLineChars = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".intro-line-char"),
      );
      const cardReveals = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".card-reveal"));
      const cardContent = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".card-content"));
      const infoCards = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".info-card"));

      gsap.set(stage, {
        transformOrigin: "50% 100%",
        scale: 0.94,
        yPercent: 0,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        clipPath: "inset(8% 0% 0% 0% round 22px 22px 0px 0px)",
      });
      gsap.set(nonFeaturePanels, {
        scaleY: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set(skylineExpansionTiles, {
        opacity: 0,
        scale: 1.035,
      });
      gsap.set(skylineFeatureTiles, {
        opacity: 0,
        scale: 1.02,
      });
      gsap.set(skylineColumnTopTiles, {
        scaleY: 0,
        transformOrigin: "50% 100%",
      });
      gsap.set(skylineColumnBottomTiles, {
        scaleY: 0,
        transformOrigin: "50% 0%",
      });
      gsap.set(modulePanels, {
        opacity: 0,
        y: 22,
      });
      gsap.set(modulePanelFinal, {
        opacity: 0,
      });
      gsap.set(postSkylinePanels, {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      });
      gsap.set(postSkylineCopy, {
        opacity: 0,
        y: 18,
      });
      gsap.set(postGlobalHeadline, {
        opacity: 0,
      });
      gsap.set(postGlobalHeadlineChars, {
        opacity: 0,
        xPercent: -24,
      });
      gsap.set(postGlobalParagraph, {
        opacity: 0,
        x: -26,
      });
      gsap.set(postSkylineImageFrames, {
        opacity: 0,
        y: 18,
        scale: 0.98,
      });
      gsap.set(postSkylineImages, {
        scale: 1.08,
        filter: "brightness(0.94) saturate(0.88)",
      });
      gsap.set(apartmentSequenceTargets, {
        opacity: 0,
      });
      gsap.set(apartmentSequenceTiles, {
        opacity: 0,
        yPercent: 112,
        filter: "brightness(0.96) saturate(0.95)",
      });
      gsap.set(apartmentSequenceBoxes, {
        opacity: 0,
        y: 56,
        scale: 0.96,
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(apartmentSequenceBoxCopy, {
        opacity: 0,
        y: 18,
      });
      gsap.set(".headline-block", {
        opacity: 0,
        x: 0,
      });
      gsap.set(headlineChars, {
        yPercent: 0,
        opacity: 1,
      });
      gsap.set(introCopyTargets, {
        opacity: 0,
      });
      gsap.set(introCopyPanelTargets, {
        opacity: 0,
        scale: 0.985,
        y: 18,
      });
      gsap.set(introLineChars, {
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
          invalidateOnRefresh: true,
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
        tileMaskTargets,
        {
          opacity: 0,
          ease: "none",
        },
        0,
      );

      revealTl.fromTo(
        tileShellTargets,
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
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.to(tileImages, {
        opacity: 0.72,
        scale: 0.995,
        stagger: {
          amount: 0.35,
          from: "center",
        },
        ease: "none",
      });

      tl.to(
        tileShellTargets,
        {
          scale: 1.015,
          ease: "none",
        },
        0,
      );

      tl.to(
        introCopyTargets,
        {
          opacity: 1,
          duration: 0.18,
          ease: "none",
        },
        0.12,
      );

      tl.to(
        introCopyPanelTargets,
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
        introLineChars,
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
        introCopyPanelTargets,
        {
          y: -12,
          duration: 2.05,
          ease: "sine.inOut",
        },
        0.46,
      );

      tl.to(
        introLineChars,
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
        introCopyPanelTargets,
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
        cardReveals,
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
        cardContent,
        {
          opacity: 1,
          duration: 0.34,
          stagger: 0.18,
        },
        at(0.92),
      );

      tl.to(
        cardReveals,
        {
          xPercent: 105,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.inOut",
        },
        at(1.28),
      );

      tl.to(
        [...cardContent, ...infoCards],
        {
          opacity: 0,
          duration: 0.48,
          stagger: 0.08,
          ease: "power2.out",
        },
        at(3),
      );

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
        featureTiles,
        {
          opacity: 1,
          scale: 1.08,
          filter: "brightness(1.06) saturate(1.04)",
          ease: "power2.out",
        },
        at(1.34),
      );

      tl.to(
        featureTiles,
        {
          opacity: 0,
          duration: 0.42,
          ease: "power2.inOut",
        },
        at(2.02),
      );

      tl.to(
        skylineFeatureTiles,
        {
          opacity: 1,
          scale: 1,
          duration: 0.52,
          ease: "power2.inOut",
        },
        at(2.02),
      );

      tl.to(
        skylineColumnTopTiles,
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
        skylineColumnBottomTiles,
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
        modulePanels,
        {
          opacity: 1,
          y: 0,
          duration: 0.64,
          ease: "power2.out",
        },
        at(3.28),
      );

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
        headlineChars,
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
        modulePanelPrimary,
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        at(4.4),
      );

      tl.to(
        modulePanels,
        {
          left: `${((NO_OF_COLUMNS - 1) / NO_OF_COLUMNS) * 100}%`,
          width: `${(1 / NO_OF_COLUMNS) * 100}%`,
          duration: 0.72,
          ease: "power3.inOut",
        },
        at(4.48),
      );

      tl.to(
        modulePanelFinal,
        {
          opacity: 1,
          duration: 0.36,
          ease: "power2.out",
        },
        at(4.84),
      );

      tl.to(
        tileShellTargets,
        {
          backgroundColor: "#000000",
          ease: "none",
        },
        at(1.08),
      );

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
        modulePanels,
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        at(5.12),
      );

      tl.to(
        tileShellTargets,
        {
          backgroundColor: "#ffffff",
          duration: 0.82,
          ease: "power2.inOut",
        },
        at(5.14),
      );

      tl.to(
        nonFeaturePanels,
        {
          backgroundColor: "#ffffff",
          borderColor: "rgba(0,0,0,0.08)",
          duration: 0.82,
          ease: "power2.inOut",
        },
        at(5.14),
      );

      tl.to(
        skylineTiles,
        {
          opacity: 0,
          duration: 0.82,
          ease: "power2.inOut",
        },
        at(5.26),
      );

      tl.to(
        postSkylineCopy,
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
        postSkylineImageFrames,
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
        postGlobalHeadline,
        {
          opacity: 1,
          duration: 0.22,
          ease: "none",
        },
        at(5.58),
      );

      tl.to(
        postGlobalHeadlineChars,
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
        postGlobalParagraph,
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
        postSkylineImages,
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
        [...postGlobalHeadline, ...postGlobalParagraph],
        {
          opacity: 0,
          duration: 0.28,
          ease: "power2.out",
        },
        apartmentSequenceStart,
      );

      tl.to(
        postSkylineImageFrames,
        {
          opacity: 0,
          duration: 0.32,
          ease: "power2.out",
        },
        apartmentSequenceStart + 0.06,
      );

      tl.to(
        apartmentSequenceTargets,
        {
          opacity: 1,
          duration: 0.14,
          ease: "none",
        },
        apartmentSequenceStart + 0.08,
      );

      tl.to(
        apartmentSequenceTiles,
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
        [...postSkylinePanels, ...modulePanels],
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
        apartmentSequenceBoxes,
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
        apartmentSequenceBoxCopy,
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

      scrollRefreshFrameRef.current = window.requestAnimationFrame(() => {
        scrollRefreshFrameRef.current = null;
        ScrollTrigger.refresh();
      });
    }, sectionRef);

    return () => {
      if (hoverTileClearRef.current !== null) {
        window.clearTimeout(hoverTileClearRef.current);
        hoverTileClearRef.current = null;
      }

      if (hoverAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(hoverAnimationFrameRef.current);
        hoverAnimationFrameRef.current = null;
      }

      if (scrollRefreshFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollRefreshFrameRef.current);
        scrollRefreshFrameRef.current = null;
      }

      hoverTileWaveRef.current?.kill();
      hoverTileCache.clear();
      ctx.revert();
    };
  }, [NO_OF_COLUMNS, NO_OF_ROWS, useMobileTabletLayout, hasViewport]);

  useLayoutEffect(() => {
    if (!hasViewport) {
      return;
    }

    if (useMobileTabletLayout) {
      return;
    }

    registerScrollTrigger();
    let rafId: number | null = null;
    let refreshRafId: number | null = null;
    let reasonsTrigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      const section = reasonsSectionRef.current;

      if (!section) {
        return;
      }

      const stage = section.querySelector<HTMLElement>(".reasons-stage");
      const world = section.querySelector<HTMLElement>(".reasons-world");
      const groups = gsap.utils.toArray<HTMLElement>(".reasons-group");
      const imagePlanes = gsap.utils.toArray<HTMLElement>(".reasons-image-plane");
      const textPlanes = gsap.utils.toArray<HTMLElement>(".reasons-text-plane");
      const centerPlanes = gsap.utils.toArray<HTMLElement>(".reasons-center-plane");
      const depthStep = 1820;
      const lastSceneDepth = (groups.length - 1) * depthStep;
      const maxTravel = Math.max(lastSceneDepth + 1900, 7600);

      if (!stage || !world) {
        return;
      }

      gsap.set(stage, {
        perspective: 2200,
        transformStyle: "preserve-3d",
      });
      gsap.set(world, {
        xPercent: -50,
        yPercent: -50,
        z: 0,
        transformStyle: "preserve-3d",
        force3D: true,
      });
      gsap.set(groups, {
        xPercent: -50,
        yPercent: -50,
        transformStyle: "preserve-3d",
        force3D: true,
      });
      gsap.set(imagePlanes, {
        transformStyle: "preserve-3d",
        opacity: 1,
        z: 0,
        force3D: true,
      });
      gsap.set(textPlanes, {
        transformStyle: "preserve-3d",
        opacity: 1,
        z: 160,
        force3D: true,
      });
      gsap.set(centerPlanes, {
        transformStyle: "preserve-3d",
        opacity: 1,
        z: 100,
        force3D: true,
      });

      const worldSetZ = gsap.quickSetter(world, "z", "px");
      const worldSetOpacity = gsap.quickSetter(world, "opacity");
      const worldSetY = gsap.quickSetter(world, "y", "px");
      const exitStartZ = Math.min(lastSceneDepth + 1480, maxTravel - 120);
      const exitDistance = Math.max(maxTravel - exitStartZ, 1);

      const sceneData = groups.map((group) => {
        const image = group.querySelector<HTMLElement>(".reasons-image-plane");
        const text = group.querySelector<HTMLElement>(".reasons-text-plane");
        const center = group.querySelector<HTMLElement>(".reasons-center-plane");

        return {
          group,
          image,
          text,
          center,
          depth: Number(group.dataset.depth ?? 0),
          kind: group.dataset.sceneKind ?? "center",
          align: group.dataset.align ?? "center",
          setGroupOpacity: gsap.quickSetter(group, "opacity"),
          setImageOpacity: image ? gsap.quickSetter(image, "opacity") : null,
          setImageScale: image ? gsap.quickSetter(image, "scale") : null,
          setTextOpacity: text ? gsap.quickSetter(text, "opacity") : null,
          setTextScale: text ? gsap.quickSetter(text, "scale") : null,
          setCenterOpacity: center ? gsap.quickSetter(center, "opacity") : null,
          setCenterScale: center ? gsap.quickSetter(center, "scale") : null,
          lastPointerEvents: "none" as "auto" | "none",
          lastVisibility: "visible" as "visible" | "hidden",
        };
      });

      sceneData.forEach(({ group, image, text, center, align }) => {
        group.style.willChange = "transform, opacity";
        group.style.backfaceVisibility = "hidden";
        if (image) {
          image.style.willChange = "transform, opacity";
          image.style.backfaceVisibility = "hidden";
          gsap.set(image, {
            transformOrigin:
              align === "left" ? "100% 50%" : align === "right" ? "0% 50%" : "50% 50%",
          });
        }
        if (text) {
          text.style.willChange = "transform, opacity";
          text.style.backfaceVisibility = "hidden";
          gsap.set(text, {
            transformOrigin:
              align === "left" ? "0% 50%" : align === "right" ? "100% 50%" : "50% 50%",
          });
        }
        if (center) {
          center.style.willChange = "transform, opacity";
          center.style.backfaceVisibility = "hidden";
        }
      });

      const getSceneOpacity = (relativeZ: number) => {
        if (relativeZ <= -2300) {
          return 0.035;
        }

        if (relativeZ < -520) {
          return 0.035 + ((relativeZ + 2300) / 1780) * 0.965;
        }

        if (relativeZ <= 980) {
          return 1;
        }

        if (relativeZ < 1720) {
          return 1 - (relativeZ - 980) / 740;
        }

        return 0;
      };

      const updateWorld = (progress: number) => {
        const cameraZ = progress * maxTravel;
        const exitStrength = clamp((cameraZ - exitStartZ) / exitDistance, 0, 1);
        const stageOpacity = 1 - exitStrength;
        const worldY = 0;

        worldSetZ(cameraZ);
        worldSetOpacity(stageOpacity);
        worldSetY(worldY);

        sceneData.forEach((scene) => {
          const {
            group,
            image,
            text,
            center,
            depth,
            setGroupOpacity,
            setImageOpacity,
            setImageScale,
            setTextOpacity,
            setTextScale,
            setCenterOpacity,
            setCenterScale,
          } = scene;
          const relativeZ = cameraZ - depth;
          const isFarScene = relativeZ < -2600 || relativeZ > 1900;
          const nextVisibility = isFarScene ? "hidden" : "visible";

          if (scene.lastVisibility !== nextVisibility) {
            group.style.visibility = nextVisibility;
            scene.lastVisibility = nextVisibility;
          }

          if (isFarScene) {
            setGroupOpacity(0);

            if (scene.lastPointerEvents !== "none") {
              group.style.pointerEvents = "none";
              scene.lastPointerEvents = "none";
            }

            return;
          }

          const distance = Math.abs(relativeZ);
          const closeness = clamp(1 - distance / 1320, 0, 1);
          const visibleOpacity = getSceneOpacity(relativeZ);
          const imageScale = 0.965 + closeness * 0.035;
          const textScale = 0.975 + closeness * 0.025;
          const centerScale = 0.97 + closeness * 0.03;
          const nextPointerEvents = closeness > 0.84 ? "auto" : "none";

          setGroupOpacity(visibleOpacity);

          if (scene.lastPointerEvents !== nextPointerEvents) {
            group.style.pointerEvents = nextPointerEvents;
            scene.lastPointerEvents = nextPointerEvents;
          }

          if (image && setImageOpacity && setImageScale) {
            setImageOpacity(visibleOpacity);
            setImageScale(imageScale);
          }

          if (text && setTextOpacity && setTextScale) {
            setTextOpacity(visibleOpacity);
            setTextScale(textScale);
          }

          if (center && setCenterOpacity && setCenterScale) {
            setCenterOpacity(visibleOpacity);
            setCenterScale(centerScale);
          }
        });
      };

      sceneData.forEach(({ group }, index) => {
        const baseDepth = index * depthStep;

        gsap.set(group, {
          z: -baseDepth,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "50% 50%",
        });
      });

      updateWorld(0);

      let latestProgress = 0;

      const safeUpdateWorld = (progress: number) => {
        latestProgress = clamp(progress, 0, 1);

        if (rafId !== null) {
          return;
        }

        rafId = window.requestAnimationFrame(() => {
          updateWorld(latestProgress);
          rafId = null;
        });
      };

      reasonsTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(groups.length * 960, 6000)}`,
        scrub: 0.65,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: (self) => {
          safeUpdateWorld(self.progress);
        },
        onEnter: (self) => {
          safeUpdateWorld(self.progress);
        },
        onEnterBack: (self) => {
          safeUpdateWorld(self.progress);
        },
        onLeave: () => {
          safeUpdateWorld(1);
        },
        onLeaveBack: () => {
          safeUpdateWorld(0);
        },
        onRefresh: (self) => {
          safeUpdateWorld(self.progress);
        },
      });

      refreshRafId = window.requestAnimationFrame(() => {
        refreshRafId = null;
        ScrollTrigger.refresh();
      });
    }, reasonsSectionRef);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (refreshRafId !== null) {
        window.cancelAnimationFrame(refreshRafId);
        refreshRafId = null;
      }

      reasonsTrigger?.kill();
      ctx.revert();
    };
  }, [useMobileTabletLayout, hasViewport]);

  const tileFrameStyle = {
    inset: "0px",
  };
  const isCompactReasonLayout = viewport.width > 0 && viewport.width < 960;
  const isMediumReasonLayout =
    viewport.width >= 960 && viewport.width < 1480;

  if (!hasValidGrid) {
    return null;
  }

  if (useMobileTabletLayout) {
    return (
      <TiledComponentMobile
        BASEURL={BASEURL}
        SECONDARY_BASEURL={SECONDARY_BASEURL}
        PROJECT_COORDINATES={PROJECT_SITE_COORDINATES}
      />
    );
  }

  return (
    <>
      <section
        id="services"
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
                style={tileFrameStyle}
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
                              ? "text-[clamp(2.1rem,4.8vw,4.6rem)]"
                              : "text-[clamp(2.1rem,4.8vw,4.6rem)]",
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
                {tileGrid.map(({ row, col, key, style }) => {
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
                      key={key}
                      className={[
                        "tile-cell absolute overflow-hidden",
                        featureTile ? "feature-cell" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={style}
                    >
                      <Image
                        src={`${BASEURL}/tile_${row}_${col}.jpg`}
                        alt=""
                        width={TILE_WIDTH}
                        height={TILE_HEIGHT}
                        unoptimized
                        loading={row < 2 ? "eager" : "lazy"}
                        decoding="async"
                        sizes={`${(100 / NO_OF_COLUMNS).toFixed(3)}vw`}
                        draggable={false}
                        aria-hidden="true"
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
                          loading={featureTile ? "eager" : "lazy"}
                          decoding="async"
                          sizes={`${(100 / NO_OF_COLUMNS).toFixed(3)}vw`}
                          draggable={false}
                          aria-hidden="true"
                          className={skylineClass}
                        />
                      ) : (
                        <Image
                          src={`${SECONDARY_BASEURL}/tile_${row}_${col}.jpg`}
                          alt=""
                          width={TILE_WIDTH}
                          height={TILE_HEIGHT}
                          unoptimized
                          loading="lazy"
                          decoding="async"
                          sizes={`${(100 / NO_OF_COLUMNS).toFixed(3)}vw`}
                          draggable={false}
                          aria-hidden="true"
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
                })}
              </div>
              <div className="absolute" style={tileFrameStyle}>
                {postSkylineTiles.map((tile) => {
                  const postSkylineIsImage = tile.mode === "image";

                  return (
                    <div
                      key={tile.key}
                      className="post-skyline-panel absolute z-[4] overflow-hidden bg-white text-black"
                      data-post-delay={tile.delay}
                      style={tile.style}
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
                            <h3 className="m-0 max-w-[6ch] text-[clamp(1.35rem,1.58vw,2rem)] font-semibold uppercase leading-[0.9] tracking-[-0.06em]">
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
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 768px) 50vw, 16vw"
                            draggable={false}
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
                              ? "text-[clamp(1.55rem,3.7vw,3.9rem)] font-semibold uppercase leading-[0.92] tracking-[-0.065em] md:text-[clamp(1.8rem,3.45vw,4.3rem)]"
                              : "text-[clamp(1.35rem,3.15vw,3.35rem)] font-semibold uppercase leading-[0.94] tracking-[-0.06em] md:text-[clamp(1.55rem,2.95vw,3.65rem)]",
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
                    style={getSpanningTileStyle(
                      POST_SKYLINE_HEADLINE_PANEL.row,
                      POST_SKYLINE_HEADLINE_PANEL.col,
                      POST_SKYLINE_HEADLINE_PANEL.rowSpan,
                      POST_SKYLINE_HEADLINE_PANEL.colSpan,
                      NO_OF_ROWS,
                      NO_OF_COLUMNS,
                    )}
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
                                ? "text-[clamp(1.18rem,1.82vw,2.55rem)] font-semibold uppercase leading-[0.92] tracking-[-0.06em]"
                                : "text-[clamp(1.08rem,1.68vw,2.35rem)] font-semibold uppercase leading-[0.94] tracking-[-0.055em]",
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
                    style={getSpanningTileStyle(
                      POST_SKYLINE_PARAGRAPH_PANEL.row,
                      POST_SKYLINE_PARAGRAPH_PANEL.col,
                      POST_SKYLINE_PARAGRAPH_PANEL.rowSpan,
                      POST_SKYLINE_PARAGRAPH_PANEL.colSpan,
                      NO_OF_ROWS,
                      NO_OF_COLUMNS,
                    )}
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
                      <p className="m-0 max-w-[26ch] text-[clamp(0.8rem,0.92vw,1.04rem)] font-semibold leading-[1.45] tracking-[-0.02em] text-black/78">
                        {POST_SKYLINE_PARAGRAPH}
                      </p>
                      <p className="m-0 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-black">
                        {POST_SKYLINE_PARAGRAPH_PANEL.cta}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  ref={apartmentSequenceRef}
                  className="apartment-sequence pointer-events-none absolute inset-0 z-[6]"
                >
                  <div className="absolute" style={tileFrameStyle}>
                    {tileGrid.map(({ row, col, key, style }) => (
                      <div
                        key={`apartment-sequence-${key}`}
                        className="absolute overflow-hidden"
                        style={style}
                      >
                        <Image
                          src={`/vr/tile_${row}_${col}.jpg`}
                          alt=""
                          width={TILE_WIDTH}
                          height={TILE_HEIGHT}
                          unoptimized
                          loading="lazy"
                          decoding="async"
                          sizes={`${(100 / NO_OF_COLUMNS).toFixed(3)}vw`}
                          draggable={false}
                          aria-hidden="true"
                          data-apartment-delay={getApartmentTileDelay(
                            row,
                            col,
                            NO_OF_ROWS,
                            NO_OF_COLUMNS,
                          ).toFixed(3)}
                          className="apartment-sequence-tile absolute inset-0 h-full w-full object-fill"
                        />
                      </div>
                    ))}
                  </div>

                  {mountedHoverServices.length > 0 ? (
                    <div className="pointer-events-none absolute inset-0" style={tileFrameStyle}>
                      {mountedHoverServices.map((service) =>
                        tileGrid.map(({ row, col, key, style }) => (
                          <div
                            key={`${service.id}-${key}`}
                            className="absolute overflow-hidden"
                            style={style}
                          >
                            <Image
                              src={buildTileImagePath(
                                service.tileBaseUrl,
                                row,
                                col,
                                service.tileFilePrefix,
                              )}
                              alt=""
                              width={TILE_WIDTH}
                              height={TILE_HEIGHT}
                              unoptimized
                              loading="lazy"
                              decoding="async"
                              sizes="12.5vw"
                              draggable={false}
                              aria-hidden="true"
                              data-hover-service={service.id}
                              data-hover-row={row}
                              data-hover-col={col}
                              className="service-hover-tile absolute inset-0 h-full w-full object-fill opacity-0 [backface-visibility:hidden] [transform:translateZ(0)] [will-change:opacity]"
                            />
                          </div>
                        )),
                      )}
                    </div>
                  ) : null}

                  <div className="absolute" style={tileFrameStyle}>
                    {apartmentBoxes.map((box) => (
                      <div
                        key={box.key}
                        className={[
                          "apartment-sequence-box group/service-card pointer-events-auto absolute overflow-hidden",
                          box.href ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-black/70" : "",
                          box.variant === "light" ? "bg-white text-black" : "bg-black text-white",
                        ].join(" ")}
                        data-service-card="true"
                        role={box.href ? "link" : undefined}
                        tabIndex={box.href ? 0 : undefined}
                        aria-label={box.href ? `Open ${box.titleLines.join(" ")} service page` : undefined}
                        onClick={() => handleServiceCardActivate(box)}
                        onKeyDown={(event) => handleServiceCardKeyDown(box, event)}
                        onPointerEnter={(event) => handleServiceHoverEnter(box, event)}
                        onPointerLeave={(event) => handleServiceHoverLeave(box, event)}
                        style={{
                          ...box.style,
                          opacity:
                            hoveredServiceId && hoveredServiceId !== box.id ? 0.28 : 1,
                          transition: "opacity 280ms ease",
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

                {textCards.map((card) => (
                  <div
                    key={card.title}
                    className="info-card absolute overflow-hidden"
                    style={card.style}
                  >
                    <div className="card-reveal absolute inset-0 bg-black" />

                    <div className="card-content absolute inset-0 border border-white/10 bg-black/90 p-8 text-white opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-[4px] md:p-10">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-white/42">
                        {card.title}
                      </p>

                      <p className="mt-5 max-w-[22ch] text-[clamp(0.9rem,1.12vw,1.24rem)] leading-[1.45] tracking-[-0.035em] text-white/84">
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

      <ProjectMapSection projectCoordinates={PROJECT_SITE_COORDINATES} />

      <section
        id="reasons"
        ref={reasonsSectionRef}
        className="relative z-[7] h-screen overflow-hidden bg-black text-[#f5efe4]"
      >
        <div className="reasons-stage relative h-screen overflow-hidden bg-black">
          <div className="reasons-world absolute left-1/2 top-1/2 h-[126vh] w-[126vw] [transform-style:preserve-3d]">
            {REASON_SCENES.map((scene, sceneIndex) => {
              const imageOnLeft = scene.kind === "reason" && scene.align === "left";
              const depth = sceneIndex * 1820;
              const imageLeft = isCompactReasonLayout
                ? "50%"
                : isMediumReasonLayout
                  ? imageOnLeft
                    ? "37.5%"
                    : "62.5%"
                  : imageOnLeft
                    ? "33.5%"
                    : "66.5%";
              const textLeft = isCompactReasonLayout
                ? "50%"
                : isMediumReasonLayout
                  ? imageOnLeft
                    ? "59.5%"
                    : "40.5%"
                  : imageOnLeft
                    ? "64%"
                    : "36%";
              const imageTop = isCompactReasonLayout ? "40%" : "50%";
              const textTop = isCompactReasonLayout ? "77%" : "50%";

              return (
                <article
                  key={scene.id}
                  className="reasons-group absolute left-1/2 top-1/2 h-[126vh] w-[126vw] [transform-style:preserve-3d]"
                  data-depth={depth}
                  data-scene-kind={scene.kind}
                  data-align={scene.kind === "reason" ? scene.align : "center"}
                >
                  {scene.kind === "reason" ? (
                    <>
                      <div
                        className="reasons-image-plane absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black"
                        style={{
                          left: imageLeft,
                          top: imageTop,
                          width: isCompactReasonLayout
                            ? "min(62vw, 22rem)"
                            : isMediumReasonLayout
                              ? "clamp(18rem, 26vw, 26rem)"
                              : "clamp(18rem, 30vw, 31rem)",
                          height: isCompactReasonLayout
                            ? "min(76vw, 26rem)"
                            : isMediumReasonLayout
                              ? "clamp(22rem, 32vw, 31rem)"
                              : "clamp(22rem, 40vw, 38rem)",
                        }}
                      >
                        <Image
                          src={scene.imageSrc}
                          alt={scene.imageAlt}
                          fill
                          unoptimized
                          loading="eager"
                          sizes="(max-width: 768px) 58vw, 30vw"
                          className="object-cover"
                        />
                      </div>

                      <div
                        className={`${openSans.className} reasons-text-plane absolute -translate-x-1/2 -translate-y-1/2 text-white`}
                        style={{
                          left: textLeft,
                          top: textTop,
                          width: isCompactReasonLayout
                            ? "min(78vw, 26rem)"
                            : isMediumReasonLayout
                              ? "clamp(22rem, 27vw, 31rem)"
                              : "clamp(24rem, 34vw, 39rem)",
                          textAlign: isCompactReasonLayout
                            ? "center"
                            : imageOnLeft
                              ? "left"
                              : "right",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isCompactReasonLayout
                            ? "center"
                            : imageOnLeft
                              ? "flex-start"
                              : "flex-end",
                        }}
                      >
                        <h3
                          className="m-0 text-[clamp(1.65rem,3.65vw,4.25rem)] font-semibold leading-[0.88] tracking-[-0.078em] text-[#f8f1e7] md:text-[clamp(1.8rem,3.45vw,4.55rem)]"
                          style={{
                            marginLeft:
                              isCompactReasonLayout || imageOnLeft ? "0" : "auto",
                            marginRight: isCompactReasonLayout ? "auto" : undefined,
                            maxWidth: "13ch",
                          }}
                        >
                          {scene.title}
                        </h3>
                        <p
                          className="mt-3 text-[clamp(0.72rem,0.78vw,0.86rem)] leading-[1.55] tracking-[-0.01em] text-white/58 md:text-[clamp(0.75rem,0.82vw,0.9rem)]"
                          style={{
                            marginLeft:
                              isCompactReasonLayout || imageOnLeft ? "0" : "auto",
                            marginRight: isCompactReasonLayout ? "auto" : undefined,
                            maxWidth: "34ch",
                          }}
                        >
                          {scene.body}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`${openSans.className} reasons-center-plane absolute left-1/2 top-1/2 w-[min(92vw,112rem)] -translate-x-1/2 -translate-y-1/2 text-white`}
                    >
                      <h3 className="m-0 text-center text-[clamp(2.15rem,5.8vw,5.7rem)] font-semibold leading-[0.87] tracking-[-0.082em] text-[#f8f1e7] md:text-[clamp(2.35rem,5.4vw,6.05rem)]">
                        {scene.title}
                      </h3>
                      <p className="mt-4 text-center text-[clamp(0.74rem,0.84vw,0.92rem)] leading-[1.55] tracking-[-0.01em] text-white/54">
                        {scene.text}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className={`${openSans.className} relative z-[5] bg-black text-[#f5efe4]`}
      >
        <div className="grid min-h-[100svh] grid-cols-1 border-t border-white/10 md:grid-cols-2 xl:grid-cols-5 xl:grid-rows-3">
          <div className="min-h-[9rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

          <div className="flex min-h-[9rem] flex-col justify-between gap-10 border-b border-r border-white/10 bg-black px-8 py-10 md:px-10 xl:px-11 xl:py-12">
            <div className="space-y-2 text-[clamp(1rem,1.35vw,1.52rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-[#f7f0e5]">
              <p className="m-0">Sthyra,</p>
              <p className="m-0">Bangalore, India</p>
            </div>
            <a
              href="mailto:hello@sthyra.com"
              className="text-[clamp(0.86rem,0.95vw,1.05rem)] font-semibold tracking-[-0.03em] text-white transition-colors duration-300 hover:text-white/72"
            >
              hello@sthyra.com
            </a>
          </div>

          <div className="flex min-h-[9rem] items-center justify-center border-b border-r border-white/10 bg-black px-8 py-10 text-center">
            <p className="m-0 text-[clamp(1.08rem,1.38vw,1.62rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#f7f0e5]">
              HAVE AN IDEA?
            </p>
          </div>

          <div className="flex min-h-[9rem] flex-col justify-between border-b border-r border-white/10 bg-white px-8 py-10 text-black md:px-10 xl:px-11 xl:py-12">
            <div>
              <p className="m-0 text-[0.72rem] uppercase tracking-[0.28em] text-black/46">
                STHYRA
              </p>
              <p className="mt-5 max-w-[12ch] text-[clamp(1.32rem,1.82vw,2.22rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
                Bangalore-based architectural immersion.
              </p>
            </div>
            <p className="m-0 max-w-[30ch] text-[clamp(0.78rem,0.82vw,0.88rem)] leading-[1.65] tracking-[-0.012em] text-black/62">
              Premium visualization, cinematic renders, and interactive spatial stories.
            </p>
          </div>

          <div className="min-h-[9rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

          <div className="border-b border-r border-white/10 bg-white px-8 py-10 text-black md:px-10 xl:px-11 xl:py-12">
            <div className="flex flex-col gap-4 text-[clamp(0.88rem,1.02vw,1.12rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {FOOTER_NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group/footer-wave-link inline-flex w-fit text-black transition-opacity duration-300 hover:opacity-80"
                >
                  <FooterWaveLabel label={item.label} />
                </Link>
              ))}
            </div>
          </div>

          <div className="min-h-[12rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

          <div className="min-h-[12rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

          <a
            href="mailto:hello@sthyra.com?subject=Project%20Inquiry"
            className="group/start-project relative flex min-h-[16rem] flex-col justify-between border-b border-r border-white/10 bg-white px-8 py-10 text-black transition-colors duration-300 hover:bg-[#f5eee1] md:px-10 xl:px-11 xl:py-12"
          >
            <div className="relative ml-auto h-12 w-12 overflow-hidden">
              <svg
                viewBox="0 0 64 64"
                aria-hidden="true"
                className="absolute inset-0 h-12 w-12 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-5 group-hover/start-project:-translate-y-5"
              >
                <path
                  d="M14 50L50 14M24 14H50V40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="square"
                />
              </svg>
              <svg
                viewBox="0 0 64 64"
                aria-hidden="true"
                className="absolute inset-0 h-12 w-12 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-0 group-hover/start-project:translate-y-0"
              >
                <path
                  d="M14 50L50 14M24 14H50V40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="square"
                />
              </svg>
            </div>
            <div>
              <p className="m-0 text-[0.72rem] uppercase tracking-[0.28em] text-black/46">
                Start a project
              </p>
              <p className="mt-6 max-w-[7ch] text-[clamp(1.95rem,3.35vw,3.65rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
                LET&apos;S
                <br />
                TALK
              </p>
            </div>
          </a>

          <div className="min-h-[12rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

          <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-8 py-8 md:px-10 xl:px-11">
            <p className="m-0 text-[clamp(0.84rem,0.92vw,0.98rem)] leading-[1.3] tracking-[-0.02em] text-white/90">
              ©2026 Sthyra
            </p>
          </div>

          <div className="border-b border-r border-white/10 bg-white px-8 py-10 text-black md:px-10 xl:px-11 xl:py-12">
            <div className="flex flex-col gap-4 text-[clamp(0.88rem,0.98vw,1.08rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              {FOOTER_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/footer-wave-link inline-flex w-fit text-black transition-opacity duration-300 hover:opacity-80"
                >
                  <FooterWaveLabel label={item.label} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-8 py-8 md:px-10 xl:px-11">
            <p className="m-0 max-w-[18ch] text-[clamp(0.84rem,0.9vw,0.98rem)] leading-[1.3] tracking-[-0.02em] text-white/90">
              Built for unbuilt spaces. Designed to help people see the future sooner.
            </p>
          </div>

          <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-8 py-8 md:px-10 xl:px-11">
            <p className="m-0 text-[clamp(0.84rem,0.9vw,0.98rem)] leading-[1.3] tracking-[-0.02em] text-white/90">
              Made in Bangalore
            </p>
          </div>

          <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-8 py-8 md:px-10 xl:px-11">
            <div className="flex flex-col gap-3 text-[clamp(0.84rem,0.9vw,0.98rem)] leading-[1.25] tracking-[-0.02em] text-white/90">
              {FOOTER_POLICY_LINKS.map((item) => (
                <p key={item} className="m-0">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
