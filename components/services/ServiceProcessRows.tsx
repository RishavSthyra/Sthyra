"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import type { ServicePageData } from "@/lib/services";

type ServiceProcessRowsProps = {
  steps: ServicePageData["process"];
  images: ServicePageData["imagePlaceholders"];
};

function ServiceProcessRow({
  step,
  image,
}: {
  step: ServicePageData["process"][number];
  image: ServicePageData["imagePlaceholders"][number];
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = () => {
    if (!overlayRef.current || !trackRef.current || !copyRef.current) {
      return;
    }

    gsap.killTweensOf([overlayRef.current, trackRef.current, copyRef.current]);
    gsap.fromTo(
      overlayRef.current,
      {
        autoAlpha: 0,
        clipPath: "inset(50% 0% 50% 0%)",
      },
      {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.48,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      trackRef.current,
      { xPercent: -12 },
      {
        xPercent: -38,
        duration: 7.2,
        ease: "none",
        repeat: -1,
      },
    );
    gsap.to(copyRef.current, {
      autoAlpha: 0.16,
      y: -8,
      duration: 0.32,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    if (!overlayRef.current || !trackRef.current || !copyRef.current) {
      return;
    }

    gsap.killTweensOf([overlayRef.current, trackRef.current, copyRef.current]);
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      clipPath: "inset(50% 0% 50% 0%)",
      duration: 0.38,
      ease: "power2.inOut",
    });
    gsap.to(copyRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.28,
      ease: "power2.out",
    });
  };

  return (
    <article
      className="group/process-row relative overflow-hidden border-b border-white/10"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
    >
      <div
        ref={copyRef}
        className="relative z-[1] grid gap-5 py-7 md:grid-cols-[0.25fr_0.75fr_1.4fr]"
      >
        <p className="m-0 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-white/36">
          {step.number}
        </p>
        <h3 className="m-0 text-[clamp(1.3rem,2vw,2.4rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[#f5efe4]">
          {step.title}
        </h3>
        <p className="m-0 max-w-[48rem] text-[0.95rem] leading-[1.68] tracking-[-0.016em] text-white/58">
          {step.body}
        </p>
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[2] flex items-center overflow-hidden bg-[#f5efe4] text-black opacity-0"
        aria-hidden="true"
      >
        <div
          ref={trackRef}
          className="flex min-w-[220%] items-center gap-10 whitespace-nowrap will-change-transform"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`${step.number}-${index}`} className="flex items-center gap-10">
              <span className="text-[clamp(1.55rem,3.4vw,3.65rem)] font-semibold uppercase leading-none tracking-[-0.058em]">
                {step.title}
              </span>
              <span className="relative h-16 w-52 overflow-hidden rounded-full border border-black/10 bg-black/10 shadow-[0_18px_44px_rgba(0,0,0,0.18)] md:h-20 md:w-72">
                <Image
                  src={image.imageSrc}
                  alt=""
                  fill
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
}

export default function ServiceProcessRows({ steps, images }: ServiceProcessRowsProps) {
  return (
    <div className="mt-10 grid border-t border-white/10">
      {steps.map((step, index) => (
        <ServiceProcessRow
          key={step.number}
          step={step}
          image={images[index % images.length]}
        />
      ))}
    </div>
  );
}
