"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "@/components/HomePageFooter";
import type { PortfolioStory } from "@/lib/portfolio-projects";

type ProjectStoryExperienceProps = {
  project: PortfolioStory;
  nextProject: PortfolioStory;
};

const renderLayouts = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-[8vw]",
  "lg:col-span-5 lg:col-start-2 lg:mt-[2vw]",
  "lg:col-span-6 lg:col-start-7",
  "lg:col-span-8",
  "lg:col-span-4 lg:mt-[7vw]",
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
          )
          .from(
            "[data-hero-meta]",
            { opacity: 0, y: 12, duration: 0.5 },
            0.48,
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
            y: 16,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-section-title]").forEach((title) => {
          gsap.from(title, {
            opacity: 0,
            y: 22,
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: title, start: "top 88%", once: true },
          });
        });

        gsap.from("[data-project-fact]", {
          opacity: 0,
          y: 12,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-project-facts]",
            start: "top 90%",
            once: true,
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-render-frame]").forEach((frame, index) => {
          const image = frame.querySelector<HTMLElement>("[data-render-image]");
          gsap.from(frame, {
            clipPath:
              index % 2 === 0
                ? "inset(0 100% 0 0)"
                : "inset(0 0 0 100%)",
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

        gsap.utils.toArray<HTMLElement>("[data-experience-frame]").forEach((frame, index) => {
          const image = frame.querySelector<HTMLElement>("[data-experience-image]");
          gsap.from(frame, {
            clipPath:
              index % 2 === 0
                ? "inset(0 100% 0 0)"
                : "inset(0 0 0 100%)",
            duration: 1.05,
            ease: "expo.inOut",
            scrollTrigger: { trigger: frame, start: "top 88%", once: true },
          });
          if (!image) return;
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

        gsap.from("[data-next-project]", {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.05,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: "[data-next-project]",
            start: "top 90%",
            once: true,
          },
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
        className="relative min-h-[92svh] overflow-hidden bg-[#d7d3ca]"
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

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[92rem] px-4 pb-8 text-white sm:px-7 sm:pb-10 lg:px-10 lg:pb-12">
          <p
            data-hero-meta
            className="mb-5 mt-0 text-[0.76rem] font-medium tracking-[0.04em] text-white/75"
          >
            {project.location} · {project.acreage} · {project.year}
          </p>
          <h1 className="m-0 max-w-[13ch] text-[clamp(2.2rem,5.5vw,5.6rem)] font-semibold leading-[0.92] tracking-[-0.06em] sm:max-w-[16ch]">
            {project.name.split(" ").map((word) => (
              <span key={word} className="mr-[0.18em] inline-block overflow-hidden">
                <span data-hero-line className="inline-block">{word}</span>
              </span>
            ))}
          </h1>
        </div>
      </section>

      <section className="px-4 py-[9svh] sm:px-7 lg:px-10 lg:py-[11svh]">
        <div className="mx-auto grid w-full max-w-[88rem] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-2">
            <h2
              data-section-title
              className="m-0 max-w-[19ch] text-[clamp(2rem,3.8vw,4rem)] font-semibold leading-[0.96] tracking-[-0.05em]"
            >
              {project.statement}
            </h2>
            <p
              data-story-reveal
              className="mb-0 mt-10 max-w-[38rem] text-[clamp(1rem,1.25vw,1.18rem)] font-normal leading-[1.65] tracking-[-0.018em] text-black/72 lg:mt-12"
            >
              {project.overview}
            </p>
          </div>

          <dl
            data-project-facts
            className="m-0 grid content-start grid-cols-2 border-t border-black/15 lg:col-span-3 lg:col-start-10"
          >
            {project.facts.map((fact) => (
              <div
                key={fact.label}
                data-project-fact
                className="border-b border-black/15 py-4 odd:pr-4 even:border-l even:pl-4"
              >
                <dt className="text-[0.68rem] font-medium text-black/42">
                  {fact.label}
                </dt>
                <dd className="mb-0 ml-0 mt-1.5 text-[0.86rem] font-semibold tracking-[-0.015em] text-black/78">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-[#faf9f5] px-4 py-[9svh] sm:px-7 lg:px-10 lg:py-[11svh]">
        <div className="mx-auto w-full max-w-[88rem]">
          <div className="mb-[6svh] grid gap-8 lg:grid-cols-12">
            <h2
              data-section-title
              className="m-0 max-w-[17ch] text-[clamp(2.25rem,4.2vw,4.4rem)] font-semibold leading-[0.94] tracking-[-0.055em] lg:col-span-9 lg:col-start-2"
            >
              The project before it exists.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-[5svh] lg:grid-cols-12">
            {project.renders.map((image, index) => (
              <figure
                key={image}
                data-render-frame
                className={`m-0 ${renderLayouts[index]}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ddd9d0]">
                  <div
                    data-render-image
                    className="absolute -inset-y-[6%] inset-x-0 will-change-transform"
                  >
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
                <figcaption className="mt-2.5 flex items-center justify-between text-[0.66rem] font-medium tracking-[0.03em] text-black/42">
                  <span>{project.name}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <ExperienceSection
        label="Interactive platform"
        title="One clear place for the complete project story."
        copy={project.webAppCopy}
        image={project.webAppImage}
        imageAlt={`${project.name} interactive web application`}
        href={project.webAppUrl}
        linkLabel="Open web app"
      />

      <ExperienceSection
        label="Immersive walkthrough"
        title="Move through the development before arriving."
        copy={project.walkthroughCopy}
        image={project.walkthroughImage}
        imageAlt={`${project.name} immersive walkthrough`}
        href={project.walkthroughUrl}
        linkLabel="Open walkthrough"
        reverse
      />

      <section className="bg-[#faf9f5] px-4 py-[9svh] sm:px-7 lg:px-10 lg:py-[11svh]">
        <div className="mx-auto w-full max-w-[88rem]">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6 lg:col-start-2">
              <p
                data-story-reveal
                className="mb-4 mt-0 text-[0.72rem] font-medium tracking-[0.04em] text-black/45"
              >
                Cinematic direction
              </p>
              <h2
                data-section-title
                className="m-0 max-w-[17ch] text-[clamp(2rem,3.25vw,3.4rem)] font-semibold leading-[0.96] tracking-[-0.048em]"
              >
                Built to be felt, not simply viewed.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p
                data-story-reveal
                className="m-0 max-w-[32rem] text-[0.96rem] font-normal leading-[1.62] tracking-[-0.015em] text-black/68"
              >
                {project.cinematicCopy}
              </p>
            </div>
          </div>
          <div
            data-render-frame
            className="relative mt-12 aspect-[16/8] overflow-hidden bg-[#ddd9d0] lg:mt-16"
          >
            <div data-render-image className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
              <Image
                src={project.cinematicImage}
                alt={`${project.name} cinematic art direction`}
                fill
                sizes="100vw"
                unoptimized={project.cinematicImage.startsWith("http")}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3f1eb] px-4 pb-6 pt-[9svh] sm:px-7 lg:px-10 lg:pt-[11svh]">
        <div className="mx-auto mb-5 flex w-full max-w-[88rem] items-center justify-between">
          <Link
            href="/portfolio"
            onClick={(event) =>
              navigateWithTransition(event, "/portfolio", "Selected projects")
            }
            className="inline-flex items-center gap-2 text-[0.76rem] font-semibold tracking-[-0.01em] text-black transition-opacity hover:opacity-50"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </Link>
          <span className="text-[0.7rem] font-medium text-black/42">
            Next project
          </span>
        </div>
        <Link
          href={`/portfolio/${nextProject.slug}`}
          onClick={(event) =>
            navigateWithTransition(
              event,
              `/portfolio/${nextProject.slug}`,
              nextProject.name,
            )
          }
          data-next-project
          className="group relative mx-auto block min-h-[58svh] w-full max-w-[88rem] overflow-hidden bg-[#d7d3ca] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <Image
            src={nextProject.heroImage}
            alt={`${nextProject.name} project preview`}
            fill
            sizes="100vw"
            unoptimized
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 p-6 text-white sm:p-9 lg:p-11">
            <p className="m-0 max-w-[16ch] text-[clamp(2.2rem,4.5vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.058em]">
              {nextProject.name}
            </p>
            <FiArrowRight
              className="mb-1 h-7 w-7 shrink-0 transition-transform duration-500 group-hover:translate-x-2 sm:h-9 sm:w-9"
              aria-hidden="true"
            />
          </div>
        </Link>
      </section>

      <HomePageFooter />

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
          className="m-0 max-w-[16ch] text-center text-[clamp(2.4rem,4.6vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.055em]"
        />
      </div>
    </main>
  );
}

type ExperienceSectionProps = {
  label: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
  href: string;
  linkLabel: string;
  reverse?: boolean;
};

function ExperienceSection({
  label,
  title,
  copy,
  image,
  imageAlt,
  href,
  linkLabel,
  reverse = false,
}: ExperienceSectionProps) {
  return (
    <section className="border-t border-black/10 bg-[#f3f1eb] px-4 py-[9svh] sm:px-7 lg:px-10 lg:py-[11svh]">
      <div className="mx-auto grid w-full max-w-[88rem] items-start gap-10 lg:grid-cols-12 lg:gap-5">
        <div
          className={`lg:sticky lg:top-28 ${
            reverse ? "lg:col-span-4 lg:col-start-9" : "lg:col-span-4"
          }`}
        >
          <p
            data-story-reveal
            className="mb-4 mt-0 text-[0.72rem] font-medium tracking-[0.04em] text-black/45"
          >
            {label}
          </p>
          <h2
            data-section-title
            className="m-0 max-w-[17ch] text-[clamp(1.9rem,2.9vw,3rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          >
            {title}
          </h2>
          <p
            data-story-reveal
            className="mt-7 max-w-[29rem] text-[0.94rem] font-normal leading-[1.62] tracking-[-0.015em] text-black/68"
          >
            {copy}
          </p>
          <a
            data-story-reveal
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 inline-flex items-center gap-3 border-b border-black/35 pb-1.5 text-[0.78rem] font-semibold text-black transition-colors hover:border-black hover:text-black/55"
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
          data-experience-frame
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
          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-[#faf9f5] text-black transition-transform duration-500 group-hover:rotate-45 sm:bottom-5 sm:right-5">
            <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </a>
      </div>
    </section>
  );
}
