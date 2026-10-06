"use client";

import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import {
  ArgentLoopInfiniteSlider,
  type InfiniteSliderProject,
} from "@/components/ui/argent-loop-infinite-slider";
import {
  getPortfolioAssetUrl,
  PORTFOLIO_PROJECTS,
  type PortfolioCategory,
} from "@/lib/portfolio";

type GalleryCategory = Extract<
  PortfolioCategory,
  "renders" | "walkthrough" | "web" | "twins"
>;

const categories: Array<{ id: GalleryCategory; label: string }> = [
  { id: "renders", label: "Ultra-real renders" },
  { id: "walkthrough", label: "Walkthroughs" },
  { id: "web", label: "Web apps" },
  { id: "twins", label: "Digital twins" },
];

const projectsByCategory = new Map<GalleryCategory, InfiniteSliderProject[]>(
  categories.map(({ id }) => [
    id,
    PORTFOLIO_PROJECTS.filter(
      (project) => project.category === id && Boolean(project.assetPath),
    ).map((project) => ({
      id: project.id,
      title: project.title,
      image: project.assetPath!.startsWith("/")
        ? project.assetPath!
        : getPortfolioAssetUrl(project.assetPath!),
      category: project.service,
      year: project.year,
      description:
        project.description ??
        project.imageAlt ??
        "Architectural visualization",
      href: project.externalUrl,
      linkLabel:
        project.category === "web"
          ? "Open web app"
          : project.category === "walkthrough"
            ? "Open walkthrough"
            : undefined,
    })),
  ]),
);

export default function PortfolioGallery() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("renders");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeProjects = useMemo(
    () => projectsByCategory.get(activeCategory) ?? [],
    [activeCategory],
  );

  return (
    <div className="relative h-[100svh] overflow-hidden">
      {activeCategory === "twins" ? (
        <section
          className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-[#d9d8d3] px-4 pt-20 text-[#111] sm:px-8 sm:pt-16 lg:pt-0"
          aria-labelledby="digital-twins-coming-soon"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(17,17,17,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.07)_1px,transparent_1px)] [background-size:4.5rem_4.5rem]"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[min(72vw,52rem)] w-[min(72vw,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10"
          />
          <div className="relative z-10 w-full max-w-[68rem] border border-black/10 bg-[#f6f5f0] px-6 py-10 shadow-[0_26px_90px_rgba(0,0,0,0.12)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <p className="m-0 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-black/42">
              Digital twins / Sthyra
            </p>
            <h2
              id="digital-twins-coming-soon"
              className="mt-8 max-w-[50rem] text-[clamp(2.8rem,7vw,7rem)] font-semibold uppercase leading-[0.84] tracking-[-0.075em]"
            >
              Coming
              <br />
              soon.
            </h2>
            <p className="mb-0 mt-9 max-w-[30rem] text-[0.76rem] font-normal leading-[1.55] text-black/58 sm:text-[0.86rem]">
              We&apos;re preparing a new collection of interactive spatial
              experiences. The first digital twins will be revealed here soon.
            </p>
          </div>
        </section>
      ) : (
        <ArgentLoopInfiniteSlider
          key={activeCategory}
          projects={activeProjects}
        />
      )}

      <aside
        aria-label="Portfolio services"
        className={`absolute inset-y-0 left-0 z-30 hidden w-[13rem] flex-col border-r border-black/10 bg-[#f6f5f0]/95 px-5 pb-6 pt-24 text-[#111] shadow-[18px_0_60px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          aria-label={isSidebarOpen ? "Close portfolio sidebar" : "Open portfolio sidebar"}
          aria-expanded={isSidebarOpen}
          className="absolute right-[-2.75rem] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 border-black/12 bg-[#f6f5f0]/95 text-lg text-black shadow-[12px_0_30px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {isSidebarOpen ? (
            <FiArrowLeft aria-hidden="true" className="h-5 w-5" />
          ) : (
            <FiArrowRight aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <div>
          <p className="m-0 text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-black/40">
            Selected work
          </p>
          <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em]">
            Portfolio / 04
          </p>
        </div>

        <nav
          className="my-auto flex flex-col"
          role="tablist"
          aria-label="Filter portfolio by service"
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="portfolio-gallery-panel"
                tabIndex={isSidebarOpen ? 0 : -1}
                onClick={() => setActiveCategory(category.id)}
                className={`group block border-t border-black/12 py-4 text-left transition-opacity last:border-b ${
                  isActive ? "opacity-100" : "opacity-38 hover:opacity-70"
                }`}
              >
                <span className="block text-[0.67rem] font-semibold uppercase leading-[1.15] tracking-[0.04em]">
                  {category.label}
                </span>
              </button>
            );
          })}
        </nav>

        <p className="m-0 text-[0.48rem] font-semibold uppercase leading-[1.45] tracking-[0.14em] text-black/38">
          Choose a service, then scroll or drag to explore.
        </p>
      </aside>

      <nav
        role="tablist"
        aria-label="Filter portfolio by service"
        className="absolute inset-x-3 top-[4.4rem] z-30 flex overflow-x-auto border border-black/10 bg-[#f6f5f0]/94 p-1 text-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="portfolio-gallery-panel"
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 px-3 py-2.5 text-[0.52rem] font-semibold uppercase tracking-[0.08em] transition-colors sm:flex-1 ${
                isActive
                  ? "bg-[#111] text-white"
                  : "text-black/45 hover:text-black"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </nav>

      <div
        id="portfolio-gallery-panel"
        role="tabpanel"
        aria-label={
          categories.find((category) => category.id === activeCategory)?.label
        }
        className="sr-only"
      >
        Showing {activeProjects.length} projects
      </div>
    </div>
  );
}
