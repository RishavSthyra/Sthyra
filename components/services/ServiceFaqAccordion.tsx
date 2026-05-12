"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ServicePageData } from "@/lib/services";

type ServiceFaqAccordionProps = {
  items: ServicePageData["faq"];
};

export default function ServiceFaqAccordion({ items }: ServiceFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-t border-white/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={[
              "group border-b border-white/10 transition-colors duration-300",
              isOpen ? "bg-white/[0.025]" : "hover:bg-white/[0.015]",
            ].join(" ")}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-8 py-6 text-left"
            >
              <span className="text-[clamp(1.05rem,1.45vw,1.55rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-[#f5efe4]">
                {item.question}
              </span>
              <span className="relative h-9 w-9 shrink-0 rounded-full border border-white/12 bg-white/[0.025] text-white/62 transition-colors duration-300 group-hover:border-white/24 group-hover:text-white">
                <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
                <span
                  className={[
                    "absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform duration-300",
                    isOpen ? "rotate-90 scale-y-0" : "rotate-0 scale-y-100",
                  ].join(" ")}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ y: -8 }}
                    animate={{ y: 0 }}
                    exit={{ y: -6 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="m-0 max-w-[58rem] pb-7 text-[0.9rem] leading-[1.72] tracking-[-0.014em] text-white/58"
                  >
                    {item.answer}
                  </motion.p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
