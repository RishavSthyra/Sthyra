"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortfolioStory } from "@/lib/portfolio-projects";

type ProjectStoryExperienceProps = {
  project: PortfolioStory;
  nextProject: PortfolioStory;
};

const renderLayouts = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-[18vw]",
  "lg:col-span-5 lg:col-start-2 lg:mt-[5vw]",
  "lg:col-span-6 lg:col-start-7",
  "lg:col-span-8",
  "lg:col-span-4 lg:mt-[15vw]",
];

export default function ProjectStoryExperience({
  project,
  nextProject,
}: ProjectStoryExperienceProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const entranceRef = useRef<HTMLDivElement | null>(null);
  const exitRef = useRef<HTMLDivElement | null>(null);
  const exitLabelRef = useRef<HTMLParagraphElement | null>(null);
  const isLeavingRef = useRef(false);
  const router = useRouter();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const media = gsap.matchMedia();
    let refreshFrame = 0;
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const entrance = gsap.timeline({ defaults: { ease: "power4.out" } });
        entrance
          .to(entranceRef.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "expo.inOut",
          })
          .from(
            "[data-hero-line]",
            { yPercent: 105, duration: 0.82, stagger: 0.045 },
            0.3,
          );

        gsap.fromTo(
          "[data-hero-image]",
          { scale: 1.06 },
          {
            scale: 1,
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-project-hero]",
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-story-reveal]").forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            y: 24,
            duration: 0.78,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-render-frame]").forEach((frame) => {
          const image = frame.querySelector<HTMLElement>("[data-render-image]");
          gsap.from(frame, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: frame, start: "top 92%", once: true },
          });
          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.05, yPercent: -2 },
              {
                scale: 1,
                yPercent: 2,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-experience-image]").forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 1.045 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            },
          );
        });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(entranceRef.current, { display: "none" });
      });
    }, rootRef);

    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    });

    return () => {
      if (refreshFrame !== 0) {
        window.cancelAnimationFrame(refreshFrame);
      }
      media.revert();
      context.revert();
    };
  }, [project.slug]);

  const navigateWithTransition = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
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
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    if (exitLabelRef.current) exitLabelRef.current.textContent = label;
    gsap.set(exitRef.current, {
      display: "flex",
      clipPath: "inset(100% 0 0 0)",
    });
    gsap
      .timeline()
      .to(exitRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.82,
        ease: "expo.inOut",
      })
      .fromTo(
        exitLabelRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.34, ease: "power3.out" },
        0.4,
      )
      .call(() => router.push(href), [], 0.72);
  };

  return (
    <main ref={rootRef} className="overflow-hidden bg-[#f3f1eb] text-[#11110f]">
      <section
        data-project-hero
        className="relative min-h-[100svh] overflow-hidden bg-[#d7d3ca]"
      >
        <div data-hero-image className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
          <Image
            src={project.heroImage}
            alt={`${project.name} exterior experience`}
            fill
            preload
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-7 text-white sm:px-7 sm:pb-9 lg:px-10 lg:pb-11">
          <h1 className="m-0 max-w-[15ch] text-[clamp(3.2rem,7vw,7rem)] font-semibold uppercase leading-[0.84] tracking-[-0.07em]">
            {project.name.split(" ").map((word) => (
              <span key={word} className="mr-[0.18em] inline-block overflow-hidden">
                <span data-hero-line className="inline-block">{word}</span>
              </span>
            ))}
          </h1>
        </div>
      </section>

      <section className="px-4 py-[10svh] sm:px-7 lg:px-10 lg:py-[13svh]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-2">
            <h2
              data-story-reveal
              className="m-0 max-w-[18ch] text-[clamp(2.2rem,4.6vw,4.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.055em]"
            >
              {project.statement}
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:mt-14">
              <p
                data-story-reveal
                className="m-0 max-w-[38rem] text-[clamp(1rem,1.45vw,1.3rem)] font-medium leading-[1.5] tracking-[-0.025em]"
              >
                {project.overview}
              </p>
              <div data-story-reveal className="flex flex-wrap content-start gap-x-8 gap-y-4">
                {project.facts.map((fact) => (
                  <span key={fact.label} className="text-sm font-semibold text-black/65">
                    {fact.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf9f5] px-4 py-[10svh] sm:px-7 lg:px-10 lg:py-[13svh]">
        <div className="mb-[8svh] grid gap-8 lg:grid-cols-12">
          <h2
            data-story-reveal
            className="m-0 max-w-[16ch] text-[clamp(2.6rem,5vw,5.2rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em] lg:col-span-10 lg:col-start-2"
          >
            The project before it exists.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-[8svh] lg:grid-cols-12">
          {project.renders.map((image, index) => (
            <figure
              key={image}
              data-render-frame
              className={`m-0 ${renderLayouts[index]}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#ddd9d0]">
                <div data-render-image className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
                  <Image
                    src={image}
                    alt={`${project.name} architectural render ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            </figure>
          ))}
        </div>
      </section>

      <ExperienceSection
        title="One clear place for the complete project story."
        copy={project.webAppCopy}
        image={project.webAppImage}
        imageAlt={`${project.name} interactive web application`}
        href={project.webAppUrl}
        linkLabel="Open web app"
      />

      <ExperienceSection
        title="Move through the development before arriving."
        copy={project.walkthroughCopy}
        image={project.walkthroughImage}
        imageAlt={`${project.name} immersive walkthrough`}
        href={project.walkthroughUrl}
        linkLabel="Open walkthrough"
        reverse
      />

      <section className="bg-[#faf9f5] px-4 py-[10svh] sm:px-7 lg:px-10 lg:py-[13svh]">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2
              data-story-reveal
              className="m-0 max-w-[15ch] text-[clamp(2.2rem,3.7vw,3.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.052em]"
            >
              Built to be felt, not simply viewed.
            </h2>
            <p
              data-story-reveal
              className="mt-8 max-w-[30rem] text-base font-medium leading-[1.5] tracking-[-0.02em] text-black/68"
            >
              {project.cinematicCopy}
            </p>
          </div>
          <div
            data-render-frame
            className="relative mt-4 aspect-[16/10] overflow-hidden bg-[#ddd9d0] lg:col-span-7 lg:col-start-6 lg:mt-0"
          >
            <div data-render-image className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
              <Image
                src={project.cinematicImage}
                alt={`${project.name} cinematic art direction`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={project.cinematicImage.startsWith("http")}
              className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1eb] px-4 py-[10svh] sm:px-7 lg:px-10 lg:py-[13svh]">
        <Link
          href={`/portfolio/${nextProject.slug}`}
          onClick={(event) =>
            navigateWithTransition(
              event,
              `/portfolio/${nextProject.slug}`,
              nextProject.name,
            )
          }
          className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <div className="flex items-end justify-between gap-8">
            <p className="m-0 max-w-[15ch] text-[clamp(3rem,6vw,6rem)] font-semibold uppercase leading-[0.86] tracking-[-0.068em]">
              {nextProject.name}
            </p>
            <FiArrowRight className="mb-2 h-7 w-7 shrink-0 transition-transform duration-500 group-hover:translate-x-2 sm:h-10 sm:w-10" aria-hidden="true" />
          </div>
        </Link>
        <Link
          href="/portfolio"
          onClick={(event) => navigateWithTransition(event, "/portfolio", "Selected projects")}
          className="mt-16 inline-flex items-center gap-3 rounded-full bg-[#11110f] px-5 py-3 text-sm font-semibold text-white"
        >
          <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          All projects
        </Link>
      </section>

      <div
        ref={entranceRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[110] bg-[#f3f1eb]"
      />
      <div
        ref={exitRef}
        aria-hidden="true"
        className="fixed inset-0 z-[120] hidden items-center justify-center bg-[#f3f1eb] text-[#11110f]"
      >
        <p
          ref={exitLabelRef}
          className="m-0 max-w-[14ch] text-center text-[clamp(2.6rem,5vw,5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em]"
        />
      </div>
    </main>
  );
}

type ExperienceSectionProps = {
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
  href: string;
  linkLabel: string;
  reverse?: boolean;
};

function ExperienceSection({
  title,
  copy,
  image,
  imageAlt,
  href,
  linkLabel,
  reverse = false,
}: ExperienceSectionProps) {
  return (
    <section className="bg-[#f3f1eb] px-4 py-[10svh] sm:px-7 lg:px-10 lg:py-[13svh]">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-4">
        <div className={reverse ? "lg:col-span-4 lg:col-start-9" : "lg:col-span-4"}>
          <h2
            data-story-reveal
            className="m-0 max-w-[15ch] text-[clamp(2.2rem,3.7vw,3.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.052em]"
          >
            {title}
          </h2>
          <p
            data-story-reveal
            className="mt-8 max-w-[29rem] text-base font-medium leading-[1.5] tracking-[-0.02em] text-black/68"
          >
            {copy}
          </p>
          <a
            data-story-reveal
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#11110f] px-5 py-3 text-sm font-semibold text-white"
          >
            {linkLabel}
            <FiArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${linkLabel} in a new tab`}
          className={`group relative aspect-[16/10] overflow-hidden bg-[#ddd9d0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black ${
            reverse
              ? "lg:col-span-7 lg:col-start-1 lg:row-start-1"
              : "lg:col-span-7 lg:col-start-6"
          }`}
        >
          <div data-experience-image className="absolute inset-0 will-change-transform">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={image.startsWith("http")}
              className="object-cover transition-[filter] duration-700 group-hover:brightness-[0.92]"
            />
          </div>
          <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#faf9f5] text-black transition-transform duration-500 group-hover:rotate-45 sm:bottom-5 sm:right-5">
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </a>
      </div>
    </section>
  );
}
