"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "@/components/HomePageFooter";
import type { PortfolioStory } from "@/lib/portfolio-projects";

type ProjectStoryExperienceProps = {
  project: PortfolioStory;
  nextProject: PortfolioStory;
};

export default function ProjectStoryExperience({
  project,
  nextProject,
}: ProjectStoryExperienceProps) {
  const [isAdditionalGalleryOpen, setIsAdditionalGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const lightboxReturnFocusRef = useRef<HTMLElement | null>(null);
  const entranceRef = useRef<HTMLDivElement | null>(null);
  const exitRef = useRef<HTMLDivElement | null>(null);
  const exitLabelRef = useRef<HTMLParagraphElement | null>(null);
  const isLeavingRef = useRef(false);
  const router = useRouter();
  const galleryImages = [
    ...project.renders,
    ...(project.additionalRenders ?? []),
  ];
  const isLightboxOpen = activeImageIndex !== null;

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

  useEffect(() => {
    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => window.cancelAnimationFrame(refreshFrame);
  }, [isAdditionalGalleryOpen]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      lightboxCloseRef.current?.focus();
    });

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveImageIndex(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveImageIndex((index) =>
          index === null
            ? null
            : (index - 1 + galleryImages.length) % galleryImages.length,
        );
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveImageIndex((index) =>
          index === null ? null : (index + 1) % galleryImages.length,
        );
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        lightboxRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        ) ?? [],
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      lightboxReturnFocusRef.current?.focus();
    };
  }, [galleryImages.length, isLightboxOpen]);

  const openLightbox = (index: number) => {
    lightboxReturnFocusRef.current = document.activeElement as HTMLElement;
    setActiveImageIndex(index);
  };

  const showPreviousImage = () => {
    setActiveImageIndex((index) =>
      index === null
        ? null
        : (index - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((index) =>
      index === null ? null : (index + 1) % galleryImages.length,
    );
  };

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
        className="relative h-[100dvh] min-h-[100svh] overflow-hidden bg-[#d7d3ca]"
        style={{ height: "100vh", minHeight: "100vh" }}
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

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {project.renders.map((image, index) => (
              <figure
                key={image}
                data-render-frame
                className="m-0 min-w-0"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(index)}
                  aria-label={`Open ${project.name} architectural render ${index + 1}`}
                  className="group/render relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#ddd9d0] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  <div
                    data-render-image
                    className="pointer-events-none absolute -inset-y-[6%] inset-x-0 will-change-transform"
                  >
                    <Image
                      src={image}
                      alt={`${project.name} architectural render ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 704px"
                      loading="eager"
                      fetchPriority={index < 2 ? "high" : "auto"}
                      className="object-cover"
                    />
                  </div>
                  <span className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#faf9f5]/95 text-black opacity-0 transition-[opacity,transform] duration-300 group-hover/render:scale-105 group-hover/render:opacity-100 group-focus-visible/render:opacity-100">
                    <FiMaximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>
              </figure>
            ))}
          </div>

          {project.additionalRenders?.length ? (
            <div className="mt-[6svh]">
              {!isAdditionalGalleryOpen ? (
                <button
                  type="button"
                  aria-expanded={false}
                  onClick={() => setIsAdditionalGalleryOpen(true)}
                  className="inline-flex items-center gap-3 border-b border-black/45 pb-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-black/72 transition-colors hover:border-black hover:text-black"
                >
                  <span>Show more</span>
                  <span aria-hidden="true">+</span>
                </button>
              ) : null}

              {isAdditionalGalleryOpen ? (
                <>
                  <div className="mt-[5svh] grid grid-cols-1 gap-5 md:grid-cols-2">
                    {project.additionalRenders.map((image, index) => (
                      <figure
                        key={image}
                        data-render-frame
                        className="m-0 min-w-0"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            openLightbox(project.renders.length + index)
                          }
                          aria-label={`Open ${project.name} additional architectural render ${index + 1}`}
                          className="group/render relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-[#ddd9d0] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                        >
                          <div data-render-image className="pointer-events-none absolute -inset-y-[6%] inset-x-0 will-change-transform">
                            <Image
                              src={image}
                              alt={`${project.name} additional architectural render ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 704px"
                              loading="eager"
                              className="object-cover"
                            />
                          </div>
                          <span className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#faf9f5]/95 text-black opacity-0 transition-[opacity,transform] duration-300 group-hover/render:scale-105 group-hover/render:opacity-100 group-focus-visible/render:opacity-100">
                            <FiMaximize2 className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </button>
                      </figure>
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-expanded={true}
                    onClick={() => setIsAdditionalGalleryOpen(false)}
                    className="mt-[6svh] inline-flex items-center gap-3 border-b border-black/45 pb-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-black/72 transition-colors hover:border-black hover:text-black"
                  >
                    <span>Show less</span>
                    <span aria-hidden="true">−</span>
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
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
        animateImage={false}
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

      {project.cinematicVideo ? (
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
              <video
                autoPlay
                controls
                muted
                loop
                playsInline
                preload="metadata"
                poster={project.cinematicImage}
                aria-label={`${project.name} cinematic art direction`}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={project.cinematicVideo} type="video/mp4" />
                Your browser does not support HTML video playback.
              </video>
            </div>
          </div>
        </section>
      ) : null}

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

      {activeImageIndex !== null ? (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} image viewer`}
          data-lenis-prevent
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveImageIndex(null);
            }
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/94 px-4 py-16 text-white backdrop-blur-md sm:px-8 sm:py-20"
        >
          <button
            ref={lightboxCloseRef}
            type="button"
            onClick={() => setActiveImageIndex(null)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-8 sm:top-7"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="View previous image"
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:left-7 sm:h-14 sm:w-14"
              >
                <FiChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="View next image"
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-7 sm:h-14 sm:w-14"
              >
                <FiChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </>
          ) : null}

          <div className="relative h-full max-h-[82svh] w-full max-w-[90rem]">
            <Image
              key={galleryImages[activeImageIndex]}
              src={galleryImages[activeImageIndex]}
              alt={`${project.name} architectural render ${activeImageIndex + 1} of ${galleryImages.length}`}
              fill
              sizes="95vw"
              loading="eager"
              fetchPriority="high"
              className="select-none object-contain"
            />
          </div>

          <p className="absolute bottom-5 left-1/2 m-0 -translate-x-1/2 text-[0.72rem] font-medium tracking-[0.12em] text-white/70 sm:bottom-7">
            {String(activeImageIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
          </p>
        </div>
      ) : null}
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
  animateImage?: boolean;
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
  animateImage = true,
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
          <div
            data-experience-image={animateImage ? "" : undefined}
            className="absolute inset-0 will-change-transform"
          >
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
