"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "@/components/HomePageFooter";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { PORTFOLIO_STORIES, type PortfolioStory } from "@/lib/portfolio-projects";

const CARD_PARTICLES = [
  {
    color: [37, 99, 235],
    origin: "top-right" as const,
  },
  {
    color: [5, 150, 105],
    origin: "bottom-left" as const,
  },
  {
    color: [124, 58, 237],
    origin: "top-left" as const,
  },
] satisfies Array<{
  color: [number, number, number];
  origin: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}>;

function PortfolioProjectCard({
  project,
  index,
  onOpen,
}: {
  project: PortfolioStory;
  index: number;
  onOpen: (
    event: MouseEvent<HTMLAnchorElement>,
    project: PortfolioStory,
  ) => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const particles = CARD_PARTICLES[index % CARD_PARTICLES.length];
  const particleMaskPosition = {
    "top-left": "0% 0%",
    "top-right": "100% 0%",
    "bottom-left": "0% 100%",
    "bottom-right": "100% 100%",
  }[particles.origin];
  const particleMask = `radial-gradient(circle at ${particleMaskPosition}, black 0%, black 22%, rgba(0,0,0,0.72) 38%, transparent 66%)`;
  const handleGlassPointer = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--glass-x",
      `${event.clientX - bounds.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--glass-y",
      `${event.clientY - bounds.top}px`,
    );
  };

  return (
    <article
      data-project-card
      onMouseMove={handleGlassPointer}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsActive(false);
        }
      }}
      className="portfolio-glass-card group relative isolate flex h-full flex-col overflow-hidden rounded-[0.9rem]"
    >
      <div
        data-card-image-wrap
        className="relative z-10 aspect-[16/11] shrink-0 overflow-hidden bg-[#dedbd3]"
      >
        <div
          data-card-image
          className="absolute inset-0 will-change-transform transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
        >
          <Image
            src={project.webAppImage}
            alt={`${project.name} interactive project experience`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 420px"
            preload={index === 0}
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/5 to-transparent" />
        <h2 className="absolute inset-x-6 bottom-6 z-10 m-0 whitespace-nowrap text-[clamp(1.2rem,1.4vw,1.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white">
          {project.name}
        </h2>
      </div>

      <div
        data-card-body
        style={{
          background:
            "linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.055))",
        }}
        className="portfolio-glass-body relative z-10 flex min-h-[18rem] flex-1 flex-col overflow-hidden p-6 sm:p-7"
      >
        <AnimatePresence>
          {isActive ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{
                maskImage: particleMask,
                WebkitMaskImage: particleMask,
              }}
              className="pointer-events-none absolute inset-0 z-0"
            >
              <CanvasRevealEffect
                animationSpeed={5}
                containerClassName="bg-transparent"
                colors={[particles.color]}
                opacities={[0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72, 0.72]}
                dotSize={2.1}
                showGradient={false}
                revealOrigin={particles.origin}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <p className="relative z-10 m-0 text-[0.72rem] font-medium tracking-[0.035em] text-white/62">
          {project.location} · {project.acreage}
        </p>
        <p className="relative z-10 mb-7 mt-5 text-[0.9rem] font-medium leading-[1.58] tracking-[-0.015em] text-white/82">
          {project.webAppCopy}
        </p>

        <Link
          href={`/portfolio/${project.slug}`}
          onClick={(event) => onOpen(event, project)}
          aria-label={`Explore ${project.name}`}
          className="relative z-10 mt-auto inline-flex w-full items-center justify-between pt-4 text-[0.74rem] font-semibold tracking-[-0.01em] text-white transition-colors duration-300 hover:text-white/60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
        >
          Explore project
          <FiArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  );
}

export default function PortfolioIndexExperience() {
  const rootRef = useRef<HTMLElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const transitionLabelRef = useRef<HTMLParagraphElement | null>(null);
  const isTransitioningRef = useRef(false);
  const router = useRouter();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

        intro.from("[data-hero-title]", {
          opacity: 0,
          y: 22,
          duration: 0.85,
        });

        const gridReveal = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-project-grid]",
            start: "top 86%",
          },
        });

        gridReveal
          .from(
            "[data-project-card]",
            {
              opacity: 0,
              duration: 0.65,
              stagger: 0.06,
              ease: "power3.out",
            },
            0,
          )
          .from(
            "[data-card-image-wrap]",
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 1,
              stagger: 0.06,
              ease: "expo.inOut",
            },
            0,
          )
          .from(
            "[data-card-body]",
            {
              opacity: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: "power2.out",
            },
            0.34,
          );

      });
    }, rootRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const openProject = (
    event: MouseEvent<HTMLAnchorElement>,
    project: PortfolioStory,
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(`/portfolio/${project.slug}`);
      return;
    }

    if (transitionLabelRef.current) {
      transitionLabelRef.current.textContent = project.name;
    }

    gsap.set(transitionRef.current, {
      display: "flex",
      clipPath: "inset(100% 0 0 0)",
    });

    gsap
      .timeline()
      .to(transitionRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.9,
        ease: "expo.inOut",
      })
      .fromTo(
        transitionLabelRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        0.45,
      )
      .call(() => router.push(`/portfolio/${project.slug}`), [], 0.78);
  };

  return (
    <main
      ref={rootRef}
      className="min-h-screen overflow-hidden bg-[#f2f1ed] text-[#11110f]"
    >
      <div className="relative isolate overflow-hidden">
        <Image
          src="/portfolio/portfolio-valley-background.avif"
          alt=""
          aria-hidden="true"
          width={2560}
          height={1440}
          preload
          sizes="100vw"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 16%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 16%, black 100%)",
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-auto min-h-[70svh] w-full select-none object-cover object-bottom sm:min-h-[80svh] xl:min-h-0"
        />

        <section className="relative z-10 flex min-h-[34svh] items-end justify-center pt-28 sm:pt-32">
          <div className="mx-auto w-full max-w-[80rem] px-4 pb-10 text-center sm:px-7 sm:pb-12 lg:px-8">
            <h1
              data-hero-title
              className="m-0 text-[clamp(2.2rem,3.35vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.052em]"
            >
              Selected projects
            </h1>
          </div>
        </section>

        <div className="relative z-10 mx-auto w-full max-w-[88rem] px-4 pb-16 sm:px-7 sm:pb-20 lg:px-8 lg:pb-24">
          <section aria-label="Portfolio projects" className="w-full">
            <div
              data-project-grid
              className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {PORTFOLIO_STORIES.map((project, index) => (
                <PortfolioProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  onOpen={openProject}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <HomePageFooter />

      <div
        ref={transitionRef}
        className="fixed inset-0 z-[120] hidden items-center justify-center bg-[#f2f1ed] text-[#11110f]"
        aria-hidden="true"
      >
        <p
          ref={transitionLabelRef}
          className="m-0 max-w-[16ch] text-center text-[clamp(2.6rem,7vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em]"
        />
      </div>
    </main>
  );
}
