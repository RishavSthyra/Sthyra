"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import type { ServicePageData } from "@/lib/services";

type ServiceOutputCardsProps = {
  items: ServicePageData["whatWeCreate"];
};

const CARD_REVEALS = [
  {
    containerClassName: "bg-black",
    colors: [
      [236, 72, 153],
      [232, 121, 249],
    ] as Array<[number, number, number]>,
  },
  {
    containerClassName: "bg-black",
    colors: [
      [59, 130, 246],
      [139, 92, 246],
    ] as Array<[number, number, number]>,
  },
  {
    containerClassName: "bg-black",
    colors: [
      [245, 158, 11],
      [244, 114, 182],
    ] as Array<[number, number, number]>,
  },
  {
    containerClassName: "bg-black",
    colors: [
      [16, 185, 129],
      [45, 212, 191],
    ] as Array<[number, number, number]>,
  },
  {
    containerClassName: "bg-black",
    colors: [
      [250, 250, 250],
      [148, 163, 184],
    ] as Array<[number, number, number]>,
  },
];

function CornerIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.3"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}

function CanvasCard({
  title,
  body,
  colors,
}: {
  title: string;
  body: string;
  colors: Array<[number, number, number]>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group/canvas-card relative flex min-h-[19rem] overflow-hidden border-b border-white/10 bg-black px-6 py-8 md:border-r"
    >
      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={colors}
              opacities={[0.6, 0.6, 0.6, 0.6, 0.6, 0.9, 0.9, 0.9, 0.9, 1]}
              dotSize={2}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/50 [mask-image:radial-gradient(400px_at_center,white,transparent)] dark:bg-black/90" />

      <CornerIcon className="absolute -left-3 -top-3 z-20 h-6 w-6 text-white/34 transition-colors duration-200 group-hover/canvas-card:text-white/80" />
      <CornerIcon className="absolute -bottom-3 -left-3 z-20 h-6 w-6 text-white/34 transition-colors duration-200 group-hover/canvas-card:text-white/80" />
      <CornerIcon className="absolute -right-3 -top-3 z-20 h-6 w-6 text-white/34 transition-colors duration-200 group-hover/canvas-card:text-white/80" />
      <CornerIcon className="absolute -bottom-3 -right-3 z-20 h-6 w-6 text-white/34 transition-colors duration-200 group-hover/canvas-card:text-white/80" />

      <div className="relative z-20 flex w-full items-end">
        <div className="w-full translate-y-2 transition duration-300 group-hover/canvas-card:-translate-y-2">
          <h3 className="text-[clamp(1.08rem,1.34vw,1.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white transition-colors duration-300 group-hover/canvas-card:text-white">
            {title}
          </h3>
          <p className="mt-5 text-[0.82rem] leading-[1.62] tracking-[-0.014em] text-white/54 transition duration-300 group-hover/canvas-card:text-white/82">
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ServiceOutputCards({ items }: ServiceOutputCardsProps) {
  return (
    <div className="mt-12 grid border-t border-white/10 md:grid-cols-5">
      {items.map((item, index) => {
        const reveal = CARD_REVEALS[index % CARD_REVEALS.length];

        return (
          <CanvasCard
            key={item.title}
            title={item.title}
            body={item.body}
            colors={reveal.colors}
          />
        );
      })}
    </div>
  );
}
