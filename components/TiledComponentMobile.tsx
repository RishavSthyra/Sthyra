"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Open_Sans } from "next/font/google";
import ProjectMapSection from "@/components/ProjectMapSection";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type TiledComponentMobileProps = {
  BASEURL: string;
  SECONDARY_BASEURL?: string;
  PROJECT_COORDINATES?: [number, number];
};

type IntroItem = {
  label: string;
  text: string;
};

type SkylineTile = {
  type: "image" | "text";
  src?: string;
  alt?: string;
  title?: string;
  text?: string;
  span?: string;
};

type ServiceItem = {
  id: string;
  href?: string;
  label: string;
  title: string;
  textLines: string[];
  imageSrc?: string;
  imageAlt?: string;
  tone: "dark" | "light";
  layout: "feature" | "text" | "image-strip" | "cta";
};

type ReasonItem = {
  number: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
};

type StatItem = {
  value: string;
  label: string;
};

type JournalItem = {
  category: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
};

const MOBILE_INTRO_ITEMS: IntroItem[] = [
  {
    label: "Purpose",
    text: "Turn unbuilt spaces into clear, believable, and emotionally powerful experiences.",
  },
  {
    label: "Audience",
    text: "Real estate developers, architects, sales teams, investors, and luxury property brands.",
  },
  {
    label: "Outcome",
    text: "More clarity, stronger trust, faster decisions, and a premium project perception.",
  },
];

const MOBILE_SKYLINE_TILES: SkylineTile[] = [
  {
    type: "image",
    src: `${"/SKYLINE_tiles_32"}/tile_0_2.jpg`,
    alt: "Architectural detail tile",
    span: "col-span-1 row-span-1",
  },
  {
    type: "image",
    src: "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300901.jpeg",
    alt: "Luxury entry interior",
    span: "col-span-2 row-span-2",
  },
  {
    type: "text",
    title: "Sculpting 3D into lived spaces.",
    text: "Sthyra creates premium architectural visualization and 3D rendering for homes, interiors, and real estate, turning design ideas into cinematic, market-ready spatial stories.",
    span: "col-span-1 row-span-2",
  },
  {
    type: "image",
    src: "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300850.jpeg",
    alt: "Luxury timber interior",
    span: "col-span-1 row-span-1",
  },
  {
    type: "image",
    src: "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300851.jpeg",
    alt: "Stone interior corridor",
    span: "col-span-1 row-span-1",
  },
  {
    type: "image",
    src: "https://cdn.sthyra.com/sthyra-labs/Images/hf_20260508_043934_d5a4a4f1-1642-4244-9566-9709780d939e.jpg",
    alt: "Refined luxury interior",
    span: "col-span-2 row-span-1",
  },
];

const MOBILE_SERVICES: ServiceItem[] = [
  {
    id: "interactive-web-experiences",
    href: "/services/interactive-real-estate-web-experiences",
    label: "Service 01",
    title: "Interactive Web Experiences",
    textLines: [
      "Browser-based immersion designed for modern buyers, investors, and sales teams.",
      "These experiences can include interactive masterplans, tower selectors, apartment highlights, amenities, cinematic transitions, hotspots, and project storytelling.",
    ],
    imageSrc: "/web_tiles_4x8/web_tile_1_3.jpg",
    imageAlt: "Interactive web experience preview",
    tone: "dark",
    layout: "feature",
  },
  {
    id: "cinematic-films",
    href: "/services/cinematic-real-estate-films",
    label: "Service 02",
    title: "Cinematic Films",
    textLines: [
      "High-emotion visual storytelling crafted to make unbuilt spaces feel desirable and real.",
      "These films are designed for launches, presentations, social campaigns, investor meetings, and premium website hero sections.",
    ],
    imageSrc: "/cinematic_tiles_4x8/cinematic_tile_1_3.jpg",
    imageAlt: "Cinematic film tile",
    tone: "light",
    layout: "text",
  },
  {
    id: "ultra-real-renders",
    href: "/services/ultra-real-real-estate-renders",
    label: "Service 03",
    title: "Ultra-Real Renders",
    textLines: [
      "Photorealistic imagery that removes doubt and elevates perceived project value.",
      "Every material, reflection, shadow, landscape layer, and atmosphere is shaped to feel believable.",
    ],
    imageSrc: "/unreal_tiles_4x8/unreal_tile_1_3.jpg",
    imageAlt: "Ultra-real render tile",
    tone: "dark",
    layout: "image-strip",
  },
  {
    id: "pixel-streaming",
    href: "/services/real-estate-digital-twins",
    label: "Service 04",
    title: "Digital Twins",
    textLines: [
      "A living digital replica of your project, designed to make every tower, amenity, and spatial decision instantly understandable.",
      "It turns complex real estate plans into an interactive experience buyers, teams, and stakeholders can explore with confidence.",
    ],
    imageSrc: "/pixelstreaming_tiles_4x8/pixelstreaming_tile_1_3.jpg",
    imageAlt: "Pixel streaming tile",
    tone: "light",
    layout: "text",
  },
  {
    id: "vr-ar-immersion",
    href: "/services/ar-vr-real-estate-experiences",
    label: "Service 05",
    title: "VR & AR Immersion",
    textLines: [
      "Immersive pre-construction sales tools that help buyers understand space, scale, views, amenities, interiors, and lifestyle before the project exists physically.",
    ],
    imageSrc: "/vr_tiles_4x8/vr_tile_1_3.jpg",
    imageAlt: "VR and AR immersion tile",
    tone: "dark",
    layout: "feature",
  },
  {
    id: "lets-work",
    label: "Service 06",
    title: "LET’S WORK ++",
    textLines: ["Bring the project, the ambition, and the moment. We’ll shape the stage around it."],
    tone: "light",
    layout: "cta",
  },
];

const MOBILE_REASONS: ReasonItem[] = [
  {
    number: "01",
    title: "Sell Before You Build",
    body: "Even before construction, this already feels real. Validate the market with photorealism, immersive walkthroughs, and interactive sales journeys.",
    imageSrc: "/reasons/Reason 1.jpg",
    imageAlt: "Architectural immersion showing a premium residence before construction",
  },
  {
    number: "02",
    title: "Eliminate Confusion",
    body: "No imagination required. Everything is clear. No visual noise, no technical overload, just pure clarity.",
    imageSrc: "/reasons/Reason 2.jpg",
    imageAlt: "Architectural visualization that makes a proposed space immediately understandable",
  },
  {
    number: "03",
    title: "Faster Decisions",
    body: "When people feel the space, they decide faster. Confidence drives stronger buyer action and smoother sales conversations.",
    imageSrc: "/reasons/Reason 3.jpg",
    imageAlt: "Immersive architectural image designed to accelerate buyer confidence",
  },
  {
    number: "04",
    title: "Premium Brand",
    body: "This looks a tier above. Position your project as timeless, confident, premium, and future-facing.",
    imageSrc: "/reasons/Reason 4.jpg",
    imageAlt: "Premium architectural presentation image for a future-facing project",
  },
  {
    number: "05",
    title: "Stronger Sales Conversations",
    body: "Your sales team gets a powerful visual tool that makes explanation easier, faster, and more persuasive.",
    imageSrc: "/reasons/Reason 5.jpg",
    imageAlt: "Visual sales tool for premium pre-construction real estate storytelling",
  },
  {
    number: "06",
    title: "Better Stakeholder Alignment",
    body: "Developers, architects, investors, and buyers can align around one clear visual experience instead of fragmented references.",
    imageSrc: "/reasons/Reason 6.jpg",
    imageAlt: "Architectural immersion aligning developers, investors, and buyers around one vision",
  },
];

const MOBILE_STATS: StatItem[] = [
  {
    value: "3x",
    label: "More memorable than static presentations",
  },
  {
    value: "68",
    label: "Fewer explanation gaps in buyer conversations",
  },
  {
    value: "45%",
    label: "Faster movement from interest to confidence",
  },
];

const MOBILE_JOURNAL: JournalItem[] = [
  {
    category: "Article 01",
    title: "How Immersion Changes Pre-Construction Sales",
    imageSrc: "/reasons/Reason 3.jpg",
    imageAlt: "Editorial visual for pre-construction sales article",
  },
  {
    category: "Article 02",
    title: "From Blueprint to Buyer Confidence",
    imageSrc: "/reasons/Reason 2.jpg",
    imageAlt: "Editorial visual for blueprint to buyer confidence article",
  },
  {
    category: "Article 03",
    title: "Why Premium Projects Need Spatial Storytelling",
    imageSrc: "/reasons/Reason 4.jpg",
    imageAlt: "Editorial visual for spatial storytelling article",
  },
];

const MOBILE_FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services-mobile" },
  { label: "Reasons", href: "#reasons-mobile" },
  { label: "Contact", href: "mailto:info@sthyra.com" },
];

const MOBILE_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

const MOBILE_POLICY_LINKS = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms & conditions", href: "#" },
];

function EditorialLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p
      className={[
        "m-0 text-[0.66rem] uppercase tracking-[0.28em]",
        light ? "text-black/46" : "text-white/42",
      ].join(" ")}
    >
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="space-y-3 border-t border-white/10 pt-4 md:pt-5">
      <EditorialLabel>{eyebrow}</EditorialLabel>
      <h2 className="m-0 max-w-[12ch] text-[clamp(1.65rem,5vw,2.8rem)] font-semibold leading-[0.9] tracking-[-0.078em] text-[#f7f1e7]">
        {title}
      </h2>
      {text ? (
        <p className="m-0 max-w-[40ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/60 md:text-[0.88rem]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M14 50L50 14M24 14H50V40"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ImageTile({
  src,
  alt,
  sizes,
  className = "",
  overlayClassName = "bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.38))]",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  overlayClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill unoptimized sizes={sizes} className="object-cover" />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}

function ServiceModule({ service }: { service: ServiceItem }) {
  const isLight = service.tone === "light";

  if (service.layout === "cta") {
    return (
      <a
        href="mailto:info@sthyra.com?subject=Project%20Inquiry"
        className="group grid min-h-[18rem] border-t border-b border-white/10 bg-[#f4efe7] px-4 py-5 text-black transition-colors duration-300 hover:bg-white sm:px-6 md:min-h-[20rem]"
      >
        <div className="flex items-start justify-between gap-4">
          <EditorialLabel light>{service.label}</EditorialLabel>
          <div className="relative h-9 w-9 overflow-hidden text-black md:h-10 md:w-10">
            <ArrowIcon className="absolute inset-0 h-9 w-9 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4 group-hover:-translate-y-4 md:h-10 md:w-10" />
            <ArrowIcon className="absolute inset-0 h-9 w-9 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 md:h-10 md:w-10" />
          </div>
        </div>
        <div className="mt-auto space-y-4">
          <h3 className="m-0 max-w-[8ch] text-[clamp(1.8rem,6.2vw,3.05rem)] font-semibold leading-[0.88] tracking-[-0.08em]">
            {service.title}
          </h3>
          <p className="m-0 max-w-[28ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-black/62">
            {service.textLines[0]}
          </p>
        </div>
      </a>
    );
  }

  if (service.layout === "image-strip") {
    return (
      <Link
        href={service.href ?? "#"}
        scroll
        className="group grid cursor-pointer gap-4 border-t border-white/10 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/70 md:grid-cols-[1.1fr_0.9fr] md:items-start"
      >
        <ImageTile
          src={service.imageSrc ?? ""}
          alt={service.imageAlt ?? service.title}
          sizes="(max-width: 767px) 100vw, 52vw"
          className="min-h-[13rem] md:min-h-[16rem]"
        />
        <div className="space-y-4">
          <EditorialLabel>{service.label}</EditorialLabel>
          <h3 className="m-0 max-w-[11ch] text-[clamp(1.35rem,4.4vw,2.05rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[#f7f1e7]">
            {service.title}
          </h3>
          <div className="space-y-3">
            {service.textLines.map((line) => (
              <p
                key={line}
                className="m-0 max-w-[38ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/60"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  if (service.layout === "text") {
    return (
      <Link
        href={service.href ?? "#"}
        scroll
        className={[
          "group grid cursor-pointer gap-4 border-t py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] md:min-h-[18rem] md:grid-cols-[0.85fr_1.15fr] md:gap-6",
          isLight ? "border-black/10 bg-[#f4efe7] px-4 text-black sm:px-6" : "border-white/10 bg-black px-0 text-[#f7f1e7]",
          isLight ? "focus-visible:outline-black/70" : "focus-visible:outline-white/70",
        ].join(" ")}
      >
        {service.imageSrc ? (
          <ImageTile
            src={service.imageSrc}
            alt={service.imageAlt ?? service.title}
            sizes="(max-width: 767px) 100vw, 34vw"
            className="min-h-[11rem] md:min-h-[14rem]"
            overlayClassName={
              isLight
                ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.18))]"
                : "bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.44))]"
            }
          />
        ) : null}
        <div className="space-y-4">
          <EditorialLabel light={isLight}>{service.label}</EditorialLabel>
          <h3 className="m-0 max-w-[10ch] text-[clamp(1.35rem,4.4vw,1.98rem)] font-semibold leading-[0.92] tracking-[-0.064em]">
            {service.title}
          </h3>
          <div className="space-y-3">
            {service.textLines.map((line) => (
              <p
                key={line}
                className={[
                  "m-0 max-w-[38ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em]",
                  isLight ? "text-black/66" : "text-white/60",
                ].join(" ")}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={service.href ?? "#"}
      scroll
      className="group grid cursor-pointer gap-4 border-t border-white/10 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/70 md:grid-cols-[1.1fr_0.9fr] md:gap-6"
    >
      <ImageTile
        src={service.imageSrc ?? ""}
        alt={service.imageAlt ?? service.title}
        sizes="(max-width: 767px) 100vw, 52vw"
        className="min-h-[15rem] md:min-h-[18rem]"
      />
      <div className="space-y-4 self-end">
        <EditorialLabel>{service.label}</EditorialLabel>
        <h3 className="m-0 max-w-[10ch] text-[clamp(1.45rem,4.6vw,2.25rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-[#f7f1e7]">
          {service.title}
        </h3>
        <div className="space-y-3">
          {service.textLines.map((line) => (
            <p
              key={line}
              className="m-0 max-w-[40ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/60"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
}

function ReasonCarousel({ reasons }: { reasons: ReasonItem[] }) {
  return (
    <div className="space-y-4">
      <p className="m-0 max-w-[28ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/58">
        A clearer way to sell what has not yet been built.
      </p>
      <div
        aria-label="Reasons carousel"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-5 md:scroll-px-6"
      >
        {reasons.map((reason) => (
          <article
            key={reason.number}
            className="relative w-[82vw] shrink-0 snap-start border border-white/10 bg-black md:w-[44vw] lg:w-[36vw]"
          >
            <div className="pointer-events-none absolute right-3 top-2 text-[4.3rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.07] md:right-4 md:top-3 md:text-[5rem]">
              {reason.number}
            </div>
            <ImageTile
              src={reason.imageSrc}
              alt={reason.imageAlt}
              sizes="(max-width: 767px) 82vw, 44vw"
              className="h-[16rem] md:h-[19rem]"
              overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.46))]"
            />
            <div className="space-y-4 border-t border-white/10 px-4 py-4 md:px-5 md:py-5">
              <EditorialLabel>{`Reason ${reason.number}`}</EditorialLabel>
              <h3 className="m-0 max-w-[11ch] text-[clamp(1.22rem,3.85vw,1.8rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-[#f7f1e7]">
                {reason.title}
              </h3>
              <p className="m-0 max-w-[32ch] text-[0.8rem] leading-[1.6] tracking-[-0.014em] text-white/60">
                {reason.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black">
      <div className="grid">
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-white/10 px-4 py-6 sm:px-6 md:px-8">
            <EditorialLabel>Contact</EditorialLabel>
            <h3 className="mt-4 max-w-[10ch] text-[clamp(1.55rem,4.9vw,2.45rem)] font-semibold leading-[0.9] tracking-[-0.078em] text-[#f7f1e7]">
              Bangalore-based architectural immersion.
            </h3>
            <p className="mt-4 max-w-[36ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/60">
              Premium visualization, cinematic renders, and interactive spatial stories for
              unbuilt spaces.
            </p>
          </div>

          <a
            href="mailto:info@sthyra.com?subject=Project%20Inquiry"
            className="group border-b border-white/10 bg-[#f4efe7] px-4 py-6 text-black transition-colors duration-300 hover:bg-white sm:px-6 md:px-8"
          >
            <div className="flex items-start justify-between gap-4">
              <EditorialLabel light>CTA</EditorialLabel>
              <div className="relative h-10 w-10 overflow-hidden text-black">
                <ArrowIcon className="absolute inset-0 h-10 w-10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4 group-hover:-translate-y-4" />
                <ArrowIcon className="absolute inset-0 h-10 w-10 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </div>
            <h3 className="mt-8 max-w-[7ch] text-[clamp(1.8rem,5.4vw,3rem)] font-semibold leading-[0.88] tracking-[-0.08em]">
              LET’S
              <br />
              TALK
            </h3>
          </a>
        </div>

        <div className="grid md:grid-cols-3">
          <div className="border-b border-white/10 px-4 py-5 sm:px-6 md:border-r md:px-8">
            <EditorialLabel>Navigation</EditorialLabel>
            <div className="mt-4 grid gap-3 text-[1rem] font-semibold tracking-[-0.03em] text-[#f7f1e7]">
              {MOBILE_FOOTER_LINKS.map((item) => (
                <Link key={item.label} href={item.href} className="transition-colors duration-300 hover:text-white/72">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-b border-white/10 px-4 py-5 sm:px-6 md:border-r md:px-8">
            <EditorialLabel>Social</EditorialLabel>
            <div className="mt-4 grid gap-3 text-[1rem] font-semibold tracking-[-0.03em] text-[#f7f1e7]">
              {MOBILE_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-300 hover:text-white/72"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-b border-white/10 px-4 py-5 sm:px-6 md:px-8">
            <EditorialLabel>Policy</EditorialLabel>
            <div className="mt-4 grid gap-3 text-[0.96rem] tracking-[-0.02em] text-white/66">
              {MOBILE_POLICY_LINKS.map((item) => (
                <Link key={item.label} href={item.href} className="transition-colors duration-300 hover:text-white/84">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 py-5 text-[0.86rem] tracking-[-0.01em] text-white/56 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="m-0">©2026 Sthyra</p>
          <p className="m-0">info@sthyra.com</p>
          <p className="m-0">Bangalore, India</p>
        </div>
      </div>
    </footer>
  );
}

export default function TiledComponentMobile({
  BASEURL,
  SECONDARY_BASEURL = "/SKYLINE_tiles_32",
  PROJECT_COORDINATES = [77.5946, 12.9716],
}: TiledComponentMobileProps) {
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroReady(true);
    }, 60);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const skylineTiles = MOBILE_SKYLINE_TILES.map((tile) =>
    tile.src?.startsWith("/SKYLINE_tiles_32")
      ? { ...tile, src: tile.src.replace("/SKYLINE_tiles_32", SECONDARY_BASEURL) }
      : tile,
  );

  return (
    <div className={`${openSans.className} bg-black text-[#f7f1e7] lg:hidden`}>
      <section className="border-t border-white/10 bg-black">
        <div className="relative overflow-hidden px-4 pb-6 pt-4 sm:px-6 sm:pb-8 md:px-8 md:pt-6">
          <div className="grid grid-cols-1 gap-[10px]">
            <div
              className={[
                "relative min-h-[72svh] overflow-hidden border border-white/10 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-[78svh]",
                heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
              ].join(" ")}
            >
              <ImageTile
                src={`${BASEURL}/tile_1_3.jpg`}
                alt="Cinematic architectural visualization hero"
                sizes="(max-width: 767px) 74vw, 62vw"
                className="h-full"
                overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.78))]"
              />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-6 md:px-8 md:pb-8">
                <EditorialLabel>STHYRA</EditorialLabel>
                <h1 className="mt-3 max-w-[13.2ch] text-[clamp(1.8rem,6.1vw,3.85rem)] font-semibold leading-[0.9] tracking-[-0.082em] text-[#f7f1e7]">
                  Premium architectural visualization for unbuilt spaces.
                </h1>
                <p className="mt-4 max-w-[48ch] text-[0.84rem] leading-[1.65] tracking-[-0.014em] text-white/62 md:max-w-[56ch] md:text-[0.88rem]">
                  Sthyra creates premium architectural visualization and digital spatial
                  experiences for unbuilt spaces.
                </p>
              </div>
            </div>
          </div>

          <div
            className={[
              "mt-[10px] border border-black/10 bg-[#f4efe7] px-4 py-4 text-black transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-3 md:px-5 md:py-5",
              heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: "340ms" }}
          >
            <EditorialLabel light>Positioning</EditorialLabel>
            <p className="mt-3 max-w-[20ch] text-[clamp(0.95rem,2.85vw,1.55rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
              Built to elevate how real estate is seen.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader
          eyebrow="Positioning"
          title="We bridge the gap between blueprint and reality."
        />

        <div className="mt-6 grid border-t border-white/10 md:mt-8 md:grid-cols-2">
          {MOBILE_INTRO_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={[
                "py-5",
                index !== MOBILE_INTRO_ITEMS.length - 1 ? "border-b border-white/10 md:border-b-0" : "",
                index === 1 ? "md:border-l md:border-white/10 md:px-6" : "",
                index === 0 ? "md:pr-6" : "",
                index === 2 ? "md:col-span-2 md:border-t md:border-white/10 md:pt-6" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <EditorialLabel>{item.label}</EditorialLabel>
              <p className="mt-3 max-w-[42ch] text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/60 md:text-[0.88rem]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader
          eyebrow="Transition"
          title="Friction exists in the imagination."
          text="Sculpting 3D into lived spaces."
        />

        <div className="mt-6 grid grid-cols-3 gap-[1px] bg-white/10 md:mt-8 md:grid-cols-6">
          {skylineTiles.map((tile, index) =>
            tile.type === "image" && tile.src ? (
              <div
                key={`${tile.type}-${index}`}
                className={[
                  "bg-black",
                  tile.span ?? "col-span-1 row-span-1",
                  index === 1 ? "min-h-[14rem] md:min-h-[18rem]" : "min-h-[7.5rem] md:min-h-[8.5rem]",
                ].join(" ")}
              >
                <ImageTile
                  src={tile.src}
                  alt={tile.alt ?? "Architectural tile"}
                  sizes="(max-width: 767px) 33vw, 16vw"
                  className="h-full"
                />
              </div>
            ) : (
              <div
                key={`${tile.type}-${index}`}
                className={[
                  "flex bg-[#f4efe7] px-4 py-4 text-black md:px-5 md:py-5",
                  tile.span ?? "col-span-1 row-span-1",
                ].join(" ")}
              >
                <div className="mt-auto space-y-3">
                  <EditorialLabel light>Skyline</EditorialLabel>
                  <h3 className="m-0 max-w-[10ch] text-[clamp(1.18rem,3.75vw,1.7rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
                    {tile.title}
                  </h3>
                  <p className="m-0 max-w-[30ch] text-[0.8rem] leading-[1.58] tracking-[-0.014em] text-black/66">
                    {tile.text}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <section id="services-mobile" className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader
          eyebrow="Services"
          title="Luxury-ready systems for unbuilt spaces."
          text="The same service logic as desktop, re-shaped into a sharper editorial flow for mobile and tablet."
        />

        <div className="mt-6 grid md:mt-8">
          {MOBILE_SERVICES.map((service) => (
            <ServiceModule key={service.id} service={service} />
          ))}
        </div>
      </section>

      <ProjectMapSection projectCoordinates={PROJECT_COORDINATES} />

      <section id="reasons-mobile" className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader eyebrow="Reasons" title="Why this visual language sells better." />
        <div className="mt-6 md:mt-8">
          <ReasonCarousel reasons={MOBILE_REASONS} />
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader eyebrow="Impact" title="Numbers that signal movement." />
        <div className="mt-6 border-t border-white/10 md:mt-8 md:grid md:grid-cols-3 md:gap-8">
          {MOBILE_STATS.map((stat, index) => (
            <div
              key={stat.value}
              className={[
                "py-5",
                index !== MOBILE_STATS.length - 1 ? "border-b border-white/10 md:border-b-0 md:border-r md:border-white/10 md:pr-8" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <p className="m-0 text-[clamp(2.25rem,7.8vw,3.9rem)] font-semibold leading-[0.88] tracking-[-0.08em] text-[#f7f1e7]">
                {stat.value}
              </p>
              <p className="mt-2 max-w-[20ch] text-[0.82rem] leading-[1.58] tracking-[-0.014em] text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader
          eyebrow="Final Positioning"
          title="Your product deserves the right stage. Let’s design it together."
        />

        <div className="mt-6 grid gap-[1px] bg-white/10 md:mt-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-[#f4efe7] px-4 py-5 text-black md:px-6 md:py-6">
            <EditorialLabel light>What we will cover</EditorialLabel>
            <div className="mt-4 grid gap-3">
              {[
                "Project visual strategy",
                "Interactive sales journey",
                "Cinematic launch content",
                "Spatial storytelling system",
              ].map((item) => (
                <p
                  key={item}
                  className="m-0 border-t border-black/10 pt-3 text-[0.82rem] leading-[1.55] tracking-[-0.014em] text-black/74"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <a
            href="mailto:info@sthyra.com?subject=Project%20Inquiry"
            className="group flex min-h-[14rem] flex-col justify-between bg-black px-4 py-5 text-[#f7f1e7] transition-colors duration-300 hover:bg-[#090909] md:px-6 md:py-6"
          >
            <div className="ml-auto h-10 w-10 overflow-hidden">
              <ArrowIcon className="h-10 w-10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:-translate-y-3" />
            </div>
            <div>
              <EditorialLabel>CTA</EditorialLabel>
              <h3 className="mt-4 max-w-[7ch] text-[clamp(1.65rem,5.25vw,2.85rem)] font-semibold leading-[0.88] tracking-[-0.08em]">
                LET’S DO THIS
              </h3>
            </div>
          </a>
        </div>
      </section>

      <section className="bg-black px-4 py-10 sm:px-6 md:px-8 md:py-12">
        <SectionHeader eyebrow="Journal" title="Editorial notes from the visual side of real estate." />
        <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-3">
          {MOBILE_JOURNAL.map((item) => (
            <article key={item.title} className="grid gap-3 border-t border-white/10 pt-4">
              <ImageTile
                src={item.imageSrc}
                alt={item.imageAlt}
                sizes="(max-width: 767px) 100vw, 33vw"
                className="h-[13rem] md:h-[12rem]"
              />
              <div className="space-y-2">
                <EditorialLabel>{item.category}</EditorialLabel>
                <h3 className="m-0 max-w-[14ch] text-[0.95rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#f7f1e7]">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
