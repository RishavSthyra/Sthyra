"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "@/components/HomePageFooter";
import { PORTFOLIO_STORIES, type PortfolioStory } from "@/lib/portfolio-projects";

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

        intro
          .from("[data-hero-title]", {
            opacity: 0,
            y: 28,
            duration: 0.85,
          })
          .from(
            "[data-hero-copy]",
            { opacity: 0, y: 24, duration: 0.7 },
            "-=0.55",
          );

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
      <section className="flex min-h-[40svh] items-end pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-[80rem] px-4 pb-10 sm:px-7 sm:pb-12 lg:px-8 lg:pb-14">
          <h1
            data-hero-title
            className="m-0 text-[clamp(3rem,4.8vw,5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.065em]"
          >
            Selected projects
          </h1>
          <p
            data-hero-copy
            className="mb-0 mt-6 max-w-[43rem] text-[clamp(0.95rem,1.2vw,1.12rem)] font-medium leading-[1.5] tracking-[-0.02em] text-black/60"
          >
            Trifecta Veranza, Tula Whisper of Trees, and Aadhya Serene—three
            residential developments presented through image, interaction, and
            motion.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[80rem] px-4 pb-16 sm:px-7 sm:pb-20 lg:px-8 lg:pb-24">
        <section aria-label="Portfolio projects" className="w-full">
          <div
            data-project-grid
            className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {PORTFOLIO_STORIES.map((project, index) => (
              <article
                key={project.slug}
                data-project-card
                className="group h-full overflow-hidden rounded-[1.15rem] bg-[#fbfaf7] shadow-[0_12px_40px_rgba(17,17,15,0.07)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_20px_54px_rgba(17,17,15,0.12)]"
              >
                <div
                  data-card-image-wrap
                  className="relative aspect-[16/11] overflow-hidden bg-[#dedbd3]"
                >
                  <div
                    data-card-image
                    className="absolute inset-0 will-change-transform transition-transform duration-700 ease-out group-hover:scale-[1.035]"
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
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />
                  <h2 className="absolute inset-x-5 bottom-5 m-0 text-[clamp(1.8rem,2.4vw,2.65rem)] font-semibold uppercase leading-[0.88] tracking-[-0.055em] text-white">
                    {project.name}
                  </h2>
                </div>

                <div data-card-body className="flex min-h-[16.5rem] flex-col p-5 sm:p-6">
                  <p className="m-0 text-[0.78rem] font-semibold tracking-[-0.01em] text-black/48">
                    {project.location} · {project.acreage}
                  </p>
                  <p className="mb-7 mt-5 text-[0.92rem] font-medium leading-[1.55] tracking-[-0.018em] text-black/68">
                    {project.webAppCopy}
                  </p>

                  <Link
                    href={`/portfolio/${project.slug}`}
                    onClick={(event) => openProject(event, project)}
                    className="mt-auto inline-flex w-full items-center justify-between rounded-full bg-[#11110f] px-5 py-3.5 text-[0.72rem] font-semibold text-white transition-colors duration-300 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
                  >
                    Explore the project
                    <FiArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <HomePageFooter />

      <div
        ref={transitionRef}
        className="fixed inset-0 z-[120] hidden items-center justify-center bg-[#f2f1ed] text-[#11110f]"
        aria-hidden="true"
      >
        <p
          ref={transitionLabelRef}
          className="m-0 max-w-[13ch] text-center text-[clamp(2.6rem,7vw,7rem)] font-semibold uppercase leading-[0.82] tracking-[-0.07em]"
        />
      </div>
    </main>
  );
}
