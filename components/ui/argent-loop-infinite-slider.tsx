"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type InfiniteSliderProject = {
  id: number;
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
  href?: string;
};

type InfiniteSliderProps = { projects: InfiniteSliderProject[] };

const BUFFER_SIZE = 3;
const SCROLL_SPEED = 0.72;
const LERP_FACTOR = 0.075;
const MAX_VELOCITY = 180;
const SNAP_DURATION = 520;

const modulo = (value: number, length: number) =>
  ((value % length) + length) % length;
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function ArgentLoopInfiniteSlider({ projects }: InfiniteSliderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const projectRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const previewRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const frameRef = useRef<number | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);

  const state = useRef({
    currentY: 0,
    targetY: 0,
    projectHeight: 1,
    cardHeight: 1,
    isDragging: false,
    isSnapping: false,
    lastInputTime: 0,
    dragStartY: 0,
    dragStartScrollY: 0,
    snapStartTime: 0,
    snapStartY: 0,
    snapTargetY: 0,
    renderedIndex: 0,
  });

  const indices = useMemo(
    () =>
      Array.from(
        { length: BUFFER_SIZE * 2 + 1 },
        (_, offset) => centerIndex - BUFFER_SIZE + offset,
      ),
    [centerIndex],
  );

  const getProject = useCallback(
    (index: number) => projects[modulo(index, projects.length)],
    [projects],
  );

  const snapToNearest = useCallback(() => {
    const slider = state.current;
    const targetIndex = Math.round(-slider.targetY / slider.projectHeight);
    slider.isSnapping = true;
    slider.snapStartTime = performance.now();
    slider.snapStartY = slider.targetY;
    slider.snapTargetY = -targetIndex * slider.projectHeight;
  }, []);

  const moveBy = useCallback((amount: number) => {
    const slider = state.current;
    slider.isSnapping = false;
    slider.lastInputTime = performance.now();
    slider.targetY -= Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, amount));
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;

    const slider = state.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMeasurements = () => {
      const previousHeight = slider.projectHeight;
      const position = previousHeight > 1 ? -slider.targetY / previousHeight : 0;
      slider.projectHeight = Math.max(root.clientHeight, 1);
      slider.cardHeight = Math.max(card.clientHeight, 1);
      slider.targetY = -position * slider.projectHeight;
      slider.currentY = slider.targetY;
    };

    const resizeObserver = new ResizeObserver(updateMeasurements);
    resizeObserver.observe(root);
    resizeObserver.observe(card);
    updateMeasurements();

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      event.preventDefault();
      const modeMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? slider.projectHeight
            : 1;
      moveBy(event.deltaY * modeMultiplier * SCROLL_SPEED);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1;
      slider.isSnapping = true;
      slider.snapStartTime = performance.now();
      slider.snapStartY = slider.targetY;
      slider.snapTargetY =
        -(Math.round(-slider.targetY / slider.projectHeight) + direction) *
        slider.projectHeight;
    };

    const renderFrame = (now: number) => {
      if (!slider.isDragging && !slider.isSnapping && now - slider.lastInputTime > 110) {
        const nearest = -Math.round(-slider.targetY / slider.projectHeight) * slider.projectHeight;
        if (Math.abs(slider.targetY - nearest) > 0.5) snapToNearest();
      }

      if (slider.isSnapping) {
        const progress = Math.min((now - slider.snapStartTime) / SNAP_DURATION, 1);
        slider.targetY =
          slider.snapStartY +
          (slider.snapTargetY - slider.snapStartY) * easeOutCubic(progress);
        if (progress >= 1) slider.isSnapping = false;
      }

      const smoothing = reducedMotion.matches ? 0.24 : LERP_FACTOR;
      slider.currentY += (slider.targetY - slider.currentY) * smoothing;
      const previewY = (slider.currentY * slider.cardHeight) / slider.projectHeight;

      projectRefs.current.forEach((element, index) => {
        const y = index * slider.projectHeight + slider.currentY;
        element.style.transform = `translate3d(0, ${y}px, 0)`;
        const image = element.querySelector<HTMLElement>("[data-slider-image]");
        if (image) {
          image.style.transform = reducedMotion.matches
            ? "scale(1.08)"
            : `translate3d(0, ${-y * 0.12}px, 0) scale(1.14)`;
        }
      });

      previewRefs.current.forEach((element, index) => {
        element.style.transform = `translate3d(0, ${index * slider.cardHeight + previewY}px, 0)`;
      });
      infoRefs.current.forEach((element, index) => {
        element.style.transform = `translate3d(0, ${index * slider.cardHeight + previewY}px, 0)`;
      });

      const nextIndex = Math.round(-slider.targetY / slider.projectHeight);
      if (nextIndex !== slider.renderedIndex) {
        slider.renderedIndex = nextIndex;
        setCenterIndex(nextIndex);
      }
      frameRef.current = window.requestAnimationFrame(renderFrame);
    };

    root.addEventListener("wheel", handleWheel, { passive: false });
    root.addEventListener("keydown", handleKeyDown);
    frameRef.current = window.requestAnimationFrame(renderFrame);

    return () => {
      root.removeEventListener("wheel", handleWheel);
      root.removeEventListener("keydown", handleKeyDown);
      resizeObserver.disconnect();
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [moveBy, projects.length, snapToNearest]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as Element).closest("[data-no-gallery-drag]")) return;
    const slider = state.current;
    slider.isDragging = true;
    slider.isSnapping = false;
    slider.lastInputTime = performance.now();
    slider.dragStartY = event.clientY;
    slider.dragStartScrollY = slider.targetY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const slider = state.current;
    if (!slider.isDragging) return;
    slider.targetY = slider.dragStartScrollY + (event.clientY - slider.dragStartY) * 1.35;
    slider.currentY = slider.targetY;
    slider.lastInputTime = performance.now();
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const slider = state.current;
    if (!slider.isDragging) return;
    slider.isDragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    snapToNearest();
  };

  if (projects.length === 0) return null;
  const activeProject = getProject(centerIndex);
  const activeNumber = modulo(centerIndex, projects.length) + 1;

  return (
    <div
      ref={rootRef}
      className="portfolio-loop-gallery relative h-[100svh] w-full cursor-grab touch-none overflow-hidden bg-[#d8d6d1] text-[#101010] outline-none active:cursor-grabbing"
      data-lenis-prevent
      tabIndex={0}
      role="region"
      aria-roledescription="infinite gallery"
      aria-label="Sthyra portfolio. Scroll, drag, or use the arrow keys to browse."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {indices.map((index) => {
          const project = getProject(index);
          return (
            <div
              key={index}
              ref={(element) => {
                if (element) projectRefs.current.set(index, element);
                else projectRefs.current.delete(index);
              }}
              className="absolute inset-0 overflow-hidden bg-[#d8d6d1] will-change-transform"
            >
              <div data-slider-image className="absolute -inset-[8%] will-change-transform">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="100vw"
                  unoptimized
                  className="object-cover [filter:none]"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),transparent_24%,transparent_76%,rgba(0,0,0,0.2))]" />

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 pt-20 sm:px-8 sm:pt-16 lg:pt-0">
        <div className="w-full max-w-[68rem] border border-black/10 bg-[#f6f5f0] p-4 shadow-[0_26px_90px_rgba(0,0,0,0.18)] sm:p-6 lg:p-8">
          <div
            ref={cardRef}
            className="grid h-[clamp(16.5rem,42vh,23rem)] grid-cols-[minmax(0,1fr)_34%] gap-5 overflow-hidden sm:gap-8 lg:grid-cols-[minmax(0,1fr)_35%] lg:gap-14"
          >
            <div className="relative overflow-hidden">
              {indices.map((index) => {
                const project = getProject(index);
                const number = modulo(index, projects.length) + 1;
                return (
                  <div
                    key={index}
                    ref={(element) => {
                      if (element) infoRefs.current.set(index, element);
                      else infoRefs.current.delete(index);
                    }}
                    className="absolute inset-0 flex flex-col justify-between py-1 pr-1 text-[0.62rem] font-semibold uppercase leading-[1.05] tracking-[-0.025em] will-change-transform sm:text-[0.74rem] lg:text-[0.86rem]"
                  >
                    <div>
                      <p className="m-0 font-mono tracking-[0.02em]">
                        {String(number).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 max-w-[28rem] text-balance text-[0.68rem] font-semibold uppercase leading-[1.05] sm:text-[0.86rem] lg:text-[1rem]">
                        {project.title}
                      </h2>
                    </div>
                    <div>
                      <p className="m-0">{project.category}</p>
                      <p className="m-0">{project.year}</p>
                    </div>
                    <div>
                      <p className="m-0 max-w-[30rem] leading-[1.24]">{project.description}</p>
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          data-no-gallery-drag
                          className="pointer-events-auto mt-3 inline-flex items-center gap-2 border-b border-black/45 pb-1 text-[0.56rem] tracking-[0.12em] transition-opacity hover:opacity-55 sm:text-[0.64rem]"
                        >
                          Open walkthrough
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative overflow-hidden bg-[#d8d6d1]">
              {indices.map((index) => {
                const project = getProject(index);
                return (
                  <div
                    key={index}
                    ref={(element) => {
                      if (element) previewRefs.current.set(index, element);
                      else previewRefs.current.delete(index);
                    }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 34vw, 24vw"
                      unoptimized
                      className="object-cover [filter:none]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-30 flex items-end justify-between text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white sm:inset-x-6 sm:bottom-6">
        <p className="m-0 drop-shadow-md">Scroll / drag</p>
        <p className="m-0 font-mono tracking-[0.08em] drop-shadow-md">
          {String(activeNumber).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {activeProject.title}, project {activeNumber} of {projects.length}.
      </p>
    </div>
  );
}
