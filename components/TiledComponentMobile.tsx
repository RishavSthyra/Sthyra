"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Montserrat } from "next/font/google";
import LazyProjectMapSection from "@/components/LazyProjectMapSection";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-mobile-title",
  display: "optional",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mobile-body",
  display: "optional",
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

const MOBILE_TRANSITION_IMAGES = [
  {
    src: "https://cdn.sthyra.com/sthyra-labs/Images/create_me_an_interior_of_202604300851.jpeg",
    alt: "Premium interior visualization for an unbuilt real estate project",
  },
  {
    src: "https://cdn.sthyra.com/sthyra-labs/Images/hf_20260507_102235_b69ea62f-63ce-42d0-9b85-0fe7870d5c4e.jpg",
    alt: "Luxury architectural exterior visualization framed by landscape",
  },
  {
    src: "https://cdn.sthyra.com/sthyra-labs/Images/hf_20260508_043934_d5a4a4f1-1642-4244-9566-9709780d939e.jpg",
    alt: "Refined interior architectural visualization with cinematic lighting",
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
    imageSrc: "https://cdn.sthyra.com/sthyra-labs/Images/InteractiveWebExperience.jpg",
    imageAlt: "Interactive web experience",
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
    imageSrc: "https://cdn.sthyra.com/sthyra-labs/Images/CinematicService.jpg",
    imageAlt: "Cinematic film",
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
    imageSrc: "https://cdn.sthyra.com/sthyra-labs/Images/ultrarealrenders%20(1).jpg",
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
    imageSrc: "https://cdn.sthyra.com/sthyra-labs/Images/digitaltwins.png",
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
    imageSrc: "https://cdn.sthyra.com/sthyra-labs/Images/arvr.png",
    imageAlt: "VR and AR immersion",
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

const MOBILE_FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services-mobile" },
  { label: "Reasons", href: "#reasons-mobile" },
  { label: "Contact", href: "https://wa.me/917075747159" },
];

const MOBILE_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

const MOBILE_POLICY_LINKS = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms & conditions", href: "/terms-and-conditions" },
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
    <div className="mx-4 space-y-4 border-y border-white/[0.08] px-0 py-8 sm:mx-6 md:mx-8 md:py-10">
      <div className="mobile-section-reveal" style={{ animationDelay: "40ms" }}>
        <EditorialLabel>{eyebrow}</EditorialLabel>
      </div>
      <h2
        className="mobile-section-reveal m-0 max-w-[22ch] text-balance text-[clamp(2rem,7.7vw,3.7rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[#f7f1e7] md:max-w-[20ch] md:text-[clamp(3.3rem,6.8vw,5.8rem)]"
        style={{ animationDelay: "140ms" }}
      >
        {title}
      </h2>
      {text ? (
        <p
          className="mobile-section-reveal m-0 max-w-[40ch] text-[0.95rem] leading-[1.56] tracking-[-0.012em] text-white/62 md:text-[1.05rem]"
          style={{ animationDelay: "240ms" }}
        >
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

function HeroTileGrid({ baseUrl }: { baseUrl: string }) {
  const rows = [0, 1, 2, 3];
  const columns = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="mobile-tile-entry absolute left-1/2 top-0 grid h-full w-[max(100%,200svh)] -translate-x-1/2 grid-cols-8 grid-rows-4">
      {rows.flatMap((row) =>
        columns.map((col) => (
          <div key={`${row}-${col}`} className="relative overflow-hidden bg-black">
            <Image
              src={`${baseUrl}/tile_${row}_${col}.jpg`}
              alt=""
              fill
              unoptimized
              sizes="13vw"
              className="object-fill"
            />
          </div>
        )),
      )}
    </div>
  );
}

function MobileIntroHero() {
  const title = "STHYRA";
  const subtitle = "Premium spatial stories for unbuilt real estate.";
  const rows = [0, 1, 2, 3];
  const columns = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <section className="relative z-0 min-h-[100svh] overflow-hidden border-y border-white/10 bg-black">
      <div className="mobile-tile-entry absolute left-1/2 top-0 grid h-full w-[max(100%,156svh)] -translate-x-1/2 grid-cols-8 grid-rows-4 md:w-[max(100%,164svh)]">
        {rows.flatMap((row) =>
          columns.map((col) => (
            <div key={`${row}-${col}`} className="relative overflow-hidden bg-black">
              <Image
                src={`/mobilehero_tiles/mobilehero_tile_${row}_${col}.jpg`}
                alt=""
                fill
                unoptimized
                sizes="13vw"
                className="object-fill"
              />
            </div>
          )),
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[1] flex justify-end px-4 pb-11 sm:px-6 md:px-8 md:pb-14">
        <div className="w-full text-right">
          <h1 className="mobile-hero-title m-0 whitespace-nowrap text-[clamp(3.05rem,15.4vw,6.15rem)] font-semibold uppercase leading-none tracking-[-0.028em] text-[#f7f1e7] [text-shadow:0_14px_42px_rgba(0,0,0,0.38)] sm:text-[clamp(3.55rem,14.4vw,7.15rem)] md:text-[clamp(6.15rem,13.2vw,8.9rem)]">
            {title.split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="mobile-hero-letter inline-block"
                style={{ animationDelay: `${180 + index * 46}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="mobile-hero-copy ml-auto mt-6 max-w-[30ch] text-[0.92rem] font-medium leading-[1.34] tracking-[-0.012em] text-white/76 sm:max-w-[36ch] sm:text-[1rem] md:mt-7 md:max-w-[46ch] md:text-[1.16rem]">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceCarouselCard({ service, index }: { service: ServiceItem; index: number }) {
  const isCta = service.layout === "cta";
  const cardTone = isCta ? "bg-[#f4efe7] text-black" : "bg-[#050505] text-[#f7f1e7]";
  const href = isCta ? "https://wa.me/917075747159" : service.href ?? "#";

  return (
    <Link
      href={href}
      scroll={!isCta}
      className={[
        "mobile-section-reveal group relative flex h-[34rem] w-[84vw] shrink-0 snap-start flex-col overflow-hidden border transition-[border-color,background-color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:w-[68vw] md:h-[38rem] md:w-[43vw]",
        isCta
          ? "border-black/10 bg-[#f4efe7] text-black focus-visible:outline-black/70"
          : "border-white/[0.1] bg-[#050505] text-[#f7f1e7] focus-visible:outline-white/70",
        cardTone,
      ].join(" ")}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      {service.imageSrc ? (
        <div className="relative h-[54%] overflow-hidden bg-black">
          <Image
            src={service.imageSrc}
            alt={service.imageAlt ?? service.title}
            fill
            unoptimized
            sizes="(max-width: 767px) 84vw, 43vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.42))]" />
        </div>
      ) : (
        <div className="relative flex h-[54%] items-end overflow-hidden bg-[#ece5da] p-5 md:p-6">
          <div className="absolute inset-x-5 top-5 h-px bg-black/14" />
          <p className="m-0 max-w-[10ch] text-[clamp(2.35rem,9vw,4.4rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em] text-black/90">
            STHYRA
          </p>
        </div>
      )}

      <div
        className={[
          "flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6",
          isCta ? "border-t border-black/10" : "border-t border-white/[0.1]",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4">
          <EditorialLabel light={isCta}>{service.label}</EditorialLabel>
          <span
            className={[
              "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1",
              isCta ? "border-black/16 text-black" : "border-white/14 text-white",
            ].join(" ")}
            aria-hidden="true"
          >
            <ArrowIcon className="h-5 w-5" />
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="m-0 max-w-[11ch] text-[clamp(1.65rem,6.8vw,2.75rem)] font-semibold leading-[0.9] tracking-[-0.06em] md:text-[clamp(2rem,3.4vw,3.35rem)]">
            {service.title}
          </h3>
          <div className="mt-4 space-y-2.5">
            {service.textLines.slice(0, 2).map((line) => (
              <p
                key={line}
                className={[
                  "m-0 max-w-[35ch] text-[0.84rem] leading-[1.5] tracking-[-0.012em] md:text-[0.9rem]",
                  isCta ? "text-black/64" : "text-white/62",
                ].join(" ")}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ReasonRows({ reasons }: { reasons: ReasonItem[] }) {
  const [activeReason, setActiveReason] = useState<string | null>(null);

  return (
    <div className="mx-4 mt-7 sm:mx-6 md:mx-8 md:mt-9">
      <p className="mobile-section-reveal m-0 max-w-[34ch] text-[0.84rem] leading-[1.62] tracking-[-0.014em] text-white/58 md:max-w-[42ch] md:text-[0.95rem]">
        A clearer way to sell what has not yet been built.
      </p>
      <div className="mt-4 grid border-t border-white/[0.09] md:mt-6">
        {reasons.map((reason) => {
          const isActive = activeReason === reason.number;

          return (
            <article
              key={reason.number}
              className="mobile-section-reveal group/reason relative cursor-pointer overflow-hidden border-b border-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/70"
              style={{ animationDelay: `${Number(reason.number) * 70}ms` }}
              tabIndex={0}
              onClick={() => setActiveReason(reason.number)}
              onFocus={() => setActiveReason(reason.number)}
              onBlur={() => setActiveReason(null)}
              onMouseEnter={() => setActiveReason(reason.number)}
              onMouseLeave={() => setActiveReason(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveReason(reason.number);
                }
              }}
            >
            <div
              className={[
                "relative z-[1] grid gap-4 py-5 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/reason:-translate-y-1 group-hover/reason:opacity-20 group-focus/reason:-translate-y-1 group-focus/reason:opacity-20 md:grid-cols-[0.16fr_0.58fr_1.26fr] md:items-center md:gap-6 md:py-7",
                isActive ? "-translate-y-1 opacity-20" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <p className="m-0 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-white/34">
                {reason.number}
              </p>
              <h3 className="m-0 max-w-[12ch] text-[clamp(1.45rem,5.2vw,2.35rem)] font-semibold leading-[0.94] tracking-[-0.058em] text-[#f7f1e7] md:text-[clamp(1.55rem,2.5vw,2.6rem)]">
                {reason.title}
              </h3>
              <p className="m-0 max-w-[56ch] text-[0.88rem] leading-[1.66] tracking-[-0.014em] text-white/58 md:text-[0.95rem]">
                {reason.body}
              </p>
            </div>

            <div
              className={[
                "pointer-events-none absolute inset-0 z-[2] flex items-center overflow-hidden bg-[#f4efe7] text-black opacity-0 [clip-path:inset(50%_0_50%_0)] transition-[opacity,clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/reason:opacity-100 group-hover/reason:[clip-path:inset(0_0_0_0)] group-focus/reason:opacity-100 group-focus/reason:[clip-path:inset(0_0_0_0)]",
                isActive ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className="mobile-reason-hover-track flex min-w-[220%] items-center gap-8 whitespace-nowrap will-change-transform group-hover/reason:[animation-play-state:running] group-focus/reason:[animation-play-state:running] md:gap-10"
                style={{ animationPlayState: isActive ? "running" : undefined }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`${reason.number}-${index}`} className="flex items-center gap-8 md:gap-10">
                    <span className="text-[clamp(1.75rem,6.4vw,3.65rem)] font-semibold uppercase leading-none tracking-[-0.058em]">
                      {reason.title}
                    </span>
                    <span className="relative h-16 w-52 overflow-hidden rounded-full border border-black/10 bg-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.18)] md:h-20 md:w-72">
                      <Image
                        src={reason.imageSrc}
                        alt=""
                        fill
                        unoptimized
                        sizes="18rem"
                        className="object-cover"
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}

function CountUpNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const match = value.match(/^(\d+)(.*)$/);
    const target = match ? Number(match[1]) : 0;
    const suffix = match?.[2] ?? "";

    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const runCounter = () => {
      if (prefersReducedMotion) {
        setDisplayValue(`${target}${suffix}`);
        return;
      }

      const start = performance.now();
      const duration = 1200;

      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(`${Math.round(target * eased)}${suffix}`);

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
      };

      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{displayValue}</span>;
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black">
      <div className="grid">
        <div className="grid gap-0 md:grid-cols-[1.08fr_0.92fr]">
          <div className="border-b border-white/10 px-4 py-8 sm:px-6 md:px-8 md:py-10">
            <EditorialLabel>Contact</EditorialLabel>
            <h3 className="mt-5 max-w-[12ch] text-balance text-[clamp(2.25rem,10.5vw,4.1rem)] font-semibold leading-[0.84] tracking-[-0.078em] text-[#f7f1e7] md:max-w-[11ch] md:text-[clamp(2.7rem,4.5vw,4.7rem)]">
              Bangalore architectural immersion.
            </h3>
            <p className="mt-6 max-w-[31ch] text-[0.96rem] leading-[1.55] tracking-[-0.014em] text-white/62 md:max-w-[38ch] md:text-[1.02rem]">
              Premium visualization, cinematic renders, and interactive spatial stories for
              unbuilt spaces.
            </p>
          </div>

          <a
            href="https://wa.me/917075747159"
            className="group flex min-h-[16rem] flex-col justify-between border-b border-white/10 bg-[#f4efe7] px-4 py-7 text-black transition-colors duration-300 hover:bg-white sm:px-6 md:min-h-0 md:px-8 md:py-10"
          >
            <div className="flex items-start justify-between gap-4">
              <EditorialLabel light>Start a project</EditorialLabel>
              <div className="relative grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center overflow-hidden rounded-full border border-black/14 text-black md:h-14 md:w-14">
                <ArrowIcon className="absolute h-8 w-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5 group-hover:-translate-y-5" />
                <ArrowIcon className="absolute h-8 w-8 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </div>
            <h3 className="mt-10 max-w-[7ch] text-[clamp(3rem,14vw,5.4rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em] md:text-[clamp(3.4rem,5.4vw,5.6rem)]">
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
  void SECONDARY_BASEURL;

  const [heroReady, setHeroReady] = useState(false);
  const heroStackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHeroReady(true);
    }, 60);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let targetProgress = 0;
    let displayedProgress = 0;

    const clampProgress = (value: number) => Math.min(1, Math.max(0, value));
    const easeProgress = (value: number) => value * value * (3 - 2 * value);

    const writeProgress = (progress: number) => {
      const stack = heroStackRef.current;

      if (!stack) {
        return;
      }

      stack.style.setProperty("--mobile-reveal-progress", easeProgress(progress).toFixed(4));
    };

    const tick = () => {
      displayedProgress += (targetProgress - displayedProgress) * 0.24;

      if (Math.abs(targetProgress - displayedProgress) < 0.001) {
        displayedProgress = targetProgress;
        writeProgress(displayedProgress);
        frame = 0;
        return;
      }

      writeProgress(displayedProgress);
      frame = window.requestAnimationFrame(tick);
    };

    const startTick = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const updateRevealProgress = () => {
      const stack = heroStackRef.current;

      if (!stack) {
        return;
      }

      const viewportHeight = window.innerHeight || 1;
      const { top } = stack.getBoundingClientRect();
      const revealDistance = Math.max(1, stack.offsetHeight - viewportHeight);

      targetProgress = clampProgress(-top / revealDistance);
      startTick();
    };

    updateRevealProgress();
    window.addEventListener("scroll", updateRevealProgress, { passive: true });
    window.addEventListener("resize", updateRevealProgress);

    return () => {
      window.removeEventListener("scroll", updateRevealProgress);
      window.removeEventListener("resize", updateRevealProgress);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const transitionImages = MOBILE_TRANSITION_IMAGES;

  return (
    <div className={`${montserrat.variable} ${dmSans.variable} mobile-home overflow-x-hidden bg-black text-[#f7f1e7] lg:hidden`}>
      <div ref={heroStackRef} className="relative z-0 h-[172svh] bg-black [--mobile-reveal-progress:0]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <MobileIntroHero />
          <section
            className="absolute inset-0 z-10 border-t border-white/10 bg-black shadow-[0_-28px_80px_rgba(0,0,0,0.34)] will-change-transform"
            style={{
              transform: "translate3d(0, calc((1 - var(--mobile-reveal-progress, 0)) * 100%), 0)",
            }}
          >
            <div className="relative h-full overflow-hidden pb-0 pt-0">
              <div
                className={[
                  "relative h-full overflow-hidden border-y border-white/10 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
                ].join(" ")}
              >
                <HeroTileGrid baseUrl={BASEURL} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.76))]" />
                <div className="absolute inset-x-0 bottom-0 px-5 pb-6 sm:px-6 md:px-8 md:pb-8">
                  <EditorialLabel>STHYRA</EditorialLabel>
                  <h1 className="mt-3 max-w-[16.5ch] border-l border-white/30 pl-3 text-[clamp(1.85rem,6.1vw,4.1rem)] font-semibold leading-[0.9] tracking-[-0.078em] text-[#f7f1e7]">
                    Premium architectural visualization for unbuilt spaces.
                  </h1>
                  <p className="mt-4 max-w-[60ch] text-[0.84rem] leading-[1.65] tracking-[-0.014em] text-white/62 md:max-w-[68ch] md:text-[0.9rem]">
                    Sthyra creates premium architectural visualization and digital spatial
                    experiences for unbuilt spaces.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* <div
        className={[
          "mt-0 border-y border-black/10 bg-[#f4efe7] px-5 py-5 text-black transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 md:px-8 md:py-6",
          heroReady ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        ].join(" ")}
        style={{ transitionDelay: "340ms" }}
      >
        <EditorialLabel light>Positioning</EditorialLabel>
        <p className="mt-3 max-w-[28ch] border-l border-black/18 pl-3 text-[clamp(0.95rem,2.85vw,1.55rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
          Built to elevate how real estate is seen.
        </p>
      </div> */}

      <section className="bg-black py-10 md:py-12">
        <SectionHeader
          eyebrow="Positioning"
          title="We bridge the gap between blueprint and reality."
        />

        <div className="mx-4 mt-7 grid border-t border-white/[0.08] sm:mx-6 md:mx-8 md:mt-9 md:grid-cols-2">
          {MOBILE_INTRO_ITEMS.map((item, index) => (
            <div
              key={item.label}
              className={[
                "mobile-section-reveal py-6 md:py-7",
                index !== MOBILE_INTRO_ITEMS.length - 1 ? "border-b border-white/[0.08] md:border-b-0" : "",
                index === 1 ? "md:border-l md:border-white/[0.08] md:px-6" : "",
                index === 0 ? "md:pr-6" : "",
                index === 2 ? "md:col-span-2 md:border-t md:border-white/[0.08] md:pt-7" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ animationDelay: `${260 + index * 120}ms` }}
            >
              <EditorialLabel>{item.label}</EditorialLabel>
              <p className="mt-4 max-w-[48ch] text-[0.95rem] leading-[1.62] tracking-[-0.012em] text-white/64 md:text-[1.05rem]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-10 md:py-14">
        <SectionHeader
          eyebrow="Transition"
          title="Friction exists in the imagination."
          text="Sculpting 3D into lived spaces."
        />

        <div
          data-lenis-prevent
          aria-label="Visualization image carousel"
          className="site-horizontal-scroll mobile-transition-carousel mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mt-10 md:gap-4 md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {transitionImages.map((tile, index) => (
            <figure
              key={`${tile.src}-${index}`}
              className="mobile-section-reveal relative m-0 aspect-[0.82] w-[78vw] max-w-[25rem] shrink-0 snap-center overflow-hidden border border-white/[0.08] bg-[#070707] shadow-[0_24px_70px_rgba(0,0,0,0.38)] sm:w-[58vw] md:aspect-[1.05] md:w-[42vw] md:max-w-[34rem]"
              style={{ animationDelay: `${120 + index * 100}ms` }}
            >
              <Image
                src={tile.src ?? ""}
                alt={tile.alt ?? "Luxury architectural visualization"}
                fill
                sizes="(max-width: 767px) 78vw, (max-width: 1023px) 58vw, 42vw"
                quality={72}
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22))]" />
              <span className="absolute bottom-4 left-4 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/54">
                {String(index + 1).padStart(2, "0")}
              </span>
            </figure>
          ))}
        </div>
      </section>

      <section id="services-mobile" className="bg-black py-10 md:py-12">
        <SectionHeader
          eyebrow="Services"
          title="Luxury-ready systems for unbuilt spaces."
          text="The same service logic as desktop, re-shaped into a sharper editorial flow for mobile and tablet."
        />

        <div
          data-lenis-prevent
          aria-label="Services carousel"
          className="site-horizontal-scroll mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mt-10 md:gap-5 md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {MOBILE_SERVICES.map((service, index) => (
            <ServiceCarouselCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <LazyProjectMapSection projectCoordinates={PROJECT_COORDINATES} />

      <section id="reasons-mobile" className="bg-black py-10 md:py-12">
        <SectionHeader eyebrow="Reasons" title="Why this visual language sells better." />
        <ReasonRows reasons={MOBILE_REASONS} />
      </section>

      <section className="bg-black py-12 md:py-16">
        <SectionHeader eyebrow="Impact" title="Numbers that signal movement." />
        <div className="mx-4 mt-8 grid gap-3 border-t border-white/[0.08] pt-3 sm:mx-6 md:mx-8 md:mt-10 md:grid-cols-3 md:gap-4 md:pt-4">
          {MOBILE_STATS.map((stat, index) => (
            <article
              key={stat.value}
              className="mobile-section-reveal relative min-h-[13rem] overflow-hidden border border-white/[0.08] bg-[#050505] px-5 py-5 md:min-h-[16rem] md:px-6 md:py-6"
              style={{ animationDelay: `${index * 110}ms` }}
            >
              <div className="absolute inset-x-5 top-5 h-px bg-white/[0.08] md:inset-x-6" />
              <p className="m-0 pt-7 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/34">
                {`Impact 0${index + 1}`}
              </p>
              <p className="mt-7 text-[clamp(3.2rem,16vw,6.5rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-[#f7f1e7] md:text-[clamp(4.4rem,8vw,7.4rem)]">
                <CountUpNumber value={stat.value} />
              </p>
              <p className="mt-4 max-w-[24ch] text-[0.9rem] leading-[1.5] tracking-[-0.014em] text-white/60 md:text-[0.96rem]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black py-12 md:py-16">
        <SectionHeader
          eyebrow="Final Positioning"
          title="Your product deserves the right stage. Let’s design it together."
        />

        <div className="mx-4 mt-8 overflow-hidden border border-white/[0.1] bg-[#050505] shadow-[0_32px_90px_rgba(0,0,0,0.34)] sm:mx-6 md:mx-8 md:mt-10">
          <div className="grid md:min-h-[30rem] md:grid-cols-[1.02fr_0.98fr]">
            <div className="bg-[#f4efe7] px-5 py-7 text-black sm:px-6 md:flex md:flex-col md:justify-between md:px-8 md:py-9">
              <EditorialLabel light>What we will shape</EditorialLabel>
              <h3 className="mt-7 max-w-[13ch] text-balance text-[clamp(2.05rem,8.2vw,3.8rem)] font-semibold leading-[0.9] tracking-[-0.07em] md:mt-0 md:text-[clamp(2.8rem,4.55vw,4.9rem)]">
                A sharper sales stage for your project.
              </h3>
              <div className="mt-8 grid border-t border-black/12 md:mt-10">
              {[
                "Project visual strategy",
                "Interactive sales journey",
                "Cinematic launch content",
                "Spatial storytelling system",
              ].map((item, index) => (
                <p
                  key={item}
                  className="m-0 flex min-h-12 items-center justify-between gap-4 border-b border-black/12 py-3.5 text-[0.88rem] leading-[1.35] tracking-[-0.014em] text-black/70 md:min-h-14 md:text-[0.96rem]"
                >
                  <span>{item}</span>
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/34">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </p>
              ))}
              </div>
            </div>

            <a
              href="https://wa.me/917075747159"
              className="group flex min-h-[24rem] flex-col justify-between border-t border-white/[0.08] bg-[linear-gradient(145deg,#050505_0%,#010101_100%)] px-5 py-7 text-[#f7f1e7] transition-colors duration-300 hover:bg-white/[0.035] sm:px-6 md:min-h-0 md:border-l md:border-t-0 md:px-8 md:py-9"
            >
              <div className="flex items-start justify-between gap-5">
                <EditorialLabel>Private briefing</EditorialLabel>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/14 bg-white/[0.025] text-white/90 shadow-[0_18px_50px_rgba(0,0,0,0.36)] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-16 md:w-16">
                  <ArrowIcon className="h-7 w-7 md:h-8 md:w-8" />
                </span>
              </div>
              <div>
                <p className="m-0 max-w-[31ch] text-[1rem] leading-[1.55] tracking-[-0.014em] text-white/62 md:text-[1.06rem]">
                  Bring the brief, the site, or the ambition. We’ll define the visual system that makes it feel inevitable.
                </p>
                <h3 className="mt-10 max-w-[8ch] text-[clamp(2.9rem,13vw,5.4rem)] font-semibold uppercase leading-[0.8] tracking-[-0.072em] md:text-[clamp(3.8rem,6vw,6rem)]">
                  LET’S DO THIS
                </h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
