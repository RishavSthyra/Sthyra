"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

import {
  getPortfolioAssetUrl,
  type PortfolioProject,
} from "@/lib/portfolio";

type RenderGalleryProps = {
  projects: PortfolioProject[];
  onOpen: (projectId: number) => void;
};

type RenderGalleryCardProps = {
  project: PortfolioProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isActive: boolean;
  onOpen: (projectId: number) => void;
};

function RenderGalleryCard({
  project,
  index,
  total,
  progress,
  isActive,
  onOpen,
}: RenderGalleryCardProps) {
  const relativePosition = useTransform(
    progress,
    (value) =>
      index -
      value * Math.max(total - 1, 1),
  );

  /*
   * THIS IS THE IMPORTANT PART.
   *
   * Straight vertical stack.
   * No radius.
   * No sine.
   * No cosine.
   */
  const y = useTransform(
    relativePosition,
    (distance) => distance * 315,
  );

  /*
   * Push cards behind the center card.
   *
   * This creates perspective without making
   * the entire gallery into a barrel.
   */
  const z = useTransform(
    relativePosition,
    (distance) =>
      -Math.abs(distance) * 150,
  );

  /*
   * Adjacent cards tilt away from center.
   *
   * Above = positive tilt
   * Below = negative tilt
   */
  const rotateX = useTransform(
    relativePosition,
    (distance) => distance * -26,
  );

  /*
   * Slight distance fade only.
   */
  const opacity = useTransform(
    relativePosition,
    (distance) => {
      const d = Math.abs(distance);

      if (d <= 2.7) return 1;
      if (d >= 3.5) return 0;

      return 1 - (d - 2.7) / 0.8;
    },
  );

  /*
   * Reference image does not use dramatic
   * artificial scaling.
   */
  const brightness = useTransform(
    relativePosition,
    (distance) => {
      const d = Math.abs(distance);

      return Math.max(
        0.68,
        1 - d * 0.08,
      );
    },
  );
  const filter = useTransform(
    brightness,
    (value) => `brightness(${value})`,
  );

  if (!project.assetPath) return null;

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (isActive) {
          onOpen(project.id);
        }
      }}
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
      aria-label={
        isActive
          ? `Open ${
              project.imageAlt ??
              project.title
            }`
          : undefined
      }
      style={{
        y,
        z,
        rotateX,
        opacity,

        filter,

        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        transformOrigin: "50% 50%",

        willChange:
          "transform, opacity, filter",
      }}
      className={`
        absolute
        left-1/2
        top-1/2

        h-[300px]
        w-[min(58vw,860px)]

        -translate-x-1/2
        -translate-y-1/2

        overflow-hidden
        bg-black

        outline-none

        md:h-[360px]

        ${
          isActive
            ? "pointer-events-auto cursor-zoom-in"
            : "pointer-events-none"
        }
      `}
    >
      <Image
        src={getPortfolioAssetUrl(
          project.assetPath,
        )}
        alt={
          project.imageAlt ??
          project.title
        }
        fill
        sizes="60vw"
        unoptimized
        className="object-cover"
      />
    </motion.button>
  );
}

export default function RenderCylinderGallery({
  projects,
  onOpen,
}: RenderGalleryProps) {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const prefersReducedMotion =
    useReducedMotion();

  const galleryProjects =
    projects.filter(
      (project) =>
        Boolean(project.assetPath),
    );

  const [activeIndex, setActiveIndex] =
    useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: [
      "start start",
      "end end",
    ],
  });

  useMotionValueEvent(
    scrollYProgress,
    "change",
    (value) => {
      const nextIndex = Math.round(
        value *
          Math.max(
            galleryProjects.length - 1,
            0,
          ),
      );

      setActiveIndex((current) =>
        current === nextIndex
          ? current
          : nextIndex,
      );
    },
  );

  /*
   * Keep multiple cards rendered
   * so there is always a stack
   * above and below.
   */
  const visibleProjects =
    galleryProjects
      .map((project, index) => ({
        project,
        index,
      }))
      .filter(
        ({ index }) =>
          Math.abs(
            index - activeIndex,
          ) <= 4,
      );

  const scrollHeight = Math.max(
    300,
    100 +
      galleryProjects.length * 42,
  );

  if (!galleryProjects.length) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Ultra-real render gallery"
      className="relative bg-black"
      style={{
        height: `${scrollHeight}vh`,
      }}
    >
      <div
        className="
          sticky
          top-0
          h-svh
          overflow-hidden
        "
      >
        {/* THE CAMERA */}
        <div
          className="
            absolute
            inset-0
          "
          style={{
            perspective:
              prefersReducedMotion
                ? "none"
                : "1150px",

            perspectiveOrigin:
              "50% 50%",
          }}
        >
          {/* 3D STACK */}
          <div
            className="
              absolute
              inset-0
            "
            style={{
              transformStyle:
                "preserve-3d",
            }}
          >
            {visibleProjects.map(
              ({
                project,
                index,
              }) => (
                <RenderGalleryCard
                  key={project.id}
                  project={project}
                  index={index}
                  total={
                    galleryProjects.length
                  }
                  progress={
                    scrollYProgress
                  }
                  isActive={
                    index ===
                    activeIndex
                  }
                  onOpen={onOpen}
                />
              ),
            )}
          </div>
        </div>

        {/* COUNTER */}

        <div
          className="
            absolute
            bottom-7
            right-8
            z-30
          "
        >
          <p
            className="
              m-0
              font-mono
              text-[0.58rem]
              tracking-[0.12em]
              text-white/42
            "
          >
            {String(
              activeIndex + 1,
            ).padStart(2, "0")}
            {" / "}
            {String(
              galleryProjects.length,
            ).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
