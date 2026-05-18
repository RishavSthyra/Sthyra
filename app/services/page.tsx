import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Montserrat } from "next/font/google";
import { SERVICE_PAGES } from "@/lib/services";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import {
  absoluteUrl,
  getBreadcrumbJsonLd,
  getHomeServicesJsonLd,
  getOrganizationJsonLd,
  jsonLdScript,
} from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "optional",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

const serviceMenuItems = SERVICE_PAGES.map((service) => ({
  label: service.hero.eyebrow,
  ariaLabel: `View ${service.hero.eyebrow}`,
  link: `/services/${service.slug}`,
}));

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  {
    label: "Services",
    ariaLabel: "Browse services",
    link: "/services",
    subItems: serviceMenuItems,
  },
  { label: "Contact", ariaLabel: "Contact Sthyra", link: "/contact" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "X", link: "https://twitter.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

const footerNavLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const footerPolicyLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms & conditions", href: "/terms-and-conditions" },
];

const serviceSummaries = [
  "Launch films for premium project reveals.",
  "Interactive sites that clarify complex spaces.",
  "Digital twins for sales rooms and teams.",
  "Photoreal renders for launch-ready campaigns.",
  "AR and VR experiences for immersive selling.",
];

const outputItems = [
  {
    title: "Launch narratives",
    body: "Films, hero renders, and campaign visuals that introduce the project with clarity and emotion.",
    imageSrc: "/Cinematic_Image_1.avif",
  },
  {
    title: "Interactive sales tools",
    body: "Web experiences, selectors, digital twins, and spatial interfaces for buyer-facing presentations.",
    imageSrc: "/ultrarender1.avif",
  },
  {
    title: "Immersive walkthroughs",
    body: "VR, AR, real-time scenes, and guided journeys that help teams sell spaces before construction.",
    imageSrc: serviceImage(4),
  },
  {
    title: "Presentation systems",
    body: "A connected visual language for websites, decks, sales galleries, investor rooms, and launches.",
    imageSrc: serviceImage(2),
  },
];

export const metadata: Metadata = {
  title: "Architectural Visualization Services",
  description:
    "Explore Sthyra services for cinematic real estate films, interactive web experiences, ultra-real renders, digital twins, AR, VR, and premium spatial storytelling.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Architectural Visualization Services | Sthyra",
    description:
      "Premium visualization services for developers, architects, sales teams, investors, and luxury property brands.",
    type: "website",
    url: "/services",
    siteName: "Sthyra",
    images: [
      {
        url: absoluteUrl("/images_last_frame.jpg"),
        width: 1200,
        height: 630,
        alt: "Sthyra architectural visualization services",
      },
    ],
  },
};

function serviceImage(serviceIndex: number) {
  const service = SERVICE_PAGES[serviceIndex];
  return service.imagePlaceholders[0]?.imageSrc ?? "/images_last_frame.jpg";
}

function getSequentialSourceColumns(totalColumns: number, visibleColumns: number) {
  const safeVisibleColumns = Math.min(totalColumns, visibleColumns);
  const startColumn = Math.max(0, Math.floor((totalColumns - safeVisibleColumns) / 2));

  return Array.from(
    { length: safeVisibleColumns },
    (_, index) => startColumn + index,
  );
}

function ServicesHeroTiles() {
  const hero = SERVICE_PAGES[0].hero;
  const sourceRowOffset = Math.max(0, 4 - hero.rows);
  const mobileColumns = Math.min(hero.columns, 3);
  const mobileRows = Math.min(hero.rows, 2);
  const mobileSourceColumns = getSequentialSourceColumns(hero.columns, mobileColumns);

  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-0 grid h-full min-w-full -translate-x-1/2 grid-cols-3 grid-rows-2 overflow-hidden [aspect-ratio:3/2] lg:hidden">
        {Array.from({ length: mobileRows }).flatMap((_, row) =>
          Array.from({ length: mobileColumns }).map((__, col) => {
            const sourceCol = mobileSourceColumns[col] ?? Math.min(hero.columns - 1, col);

            return (
              <div
                key={`mobile-${row}-${col}`}
                className="service-hero-tile relative overflow-hidden opacity-0"
                style={{
                  animationDelay: `${(row * mobileColumns + col) * 75}ms`,
                  transform: "translateZ(0)",
                }}
              >
                <Image
                  src={`${hero.tileBasePath}/${hero.tilePrefix}_${row + sourceRowOffset}_${sourceCol}.jpg`}
                  alt=""
                  fill
                  priority={row === 0 && col < 2}
                  sizes="max(34vw, 25vh)"
                  quality={78}
                  className="scale-[1.035] object-cover"
                />
              </div>
            );
          })
        )}
      </div>

      <div className="absolute inset-0 hidden lg:block">
        {Array.from({ length: hero.rows }).flatMap((_, row) =>
          Array.from({ length: hero.columns }).map((__, col) => (
            <div
              key={`desktop-${row}-${col}`}
              className="service-hero-tile absolute overflow-hidden opacity-0"
              style={{
                left: `${(col / hero.columns) * 100}%`,
                top: `${(row / hero.rows) * 100}%`,
                width: `calc(${100 / hero.columns}% + 0.5px)`,
                height: `calc(${100 / hero.rows}% + 0.5px)`,
                animationDelay: `${(row * hero.columns + col) * 45}ms`,
                transform: "translateZ(0)",
              }}
            >
              <Image
                src={`${hero.tileBasePath}/${hero.tilePrefix}_${row + sourceRowOffset}_${col}.jpg`}
                alt=""
                fill
                priority={row === 0 && col < 2}
                sizes="12.5vw"
                quality={78}
                className="scale-[1.035] object-cover"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FooterWaveLabel({ label }: { label: string }) {
  return (
    <span className="relative inline-block overflow-hidden leading-none">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/footer-wave-link:-translate-y-[115%]">
        {label}
      </span>
      <span className="absolute left-0 top-0 block translate-y-[115%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/footer-wave-link:translate-y-0">
        {label}
      </span>
    </span>
  );
}

function ServicesFooter() {
  return (
    <footer id="contact" className={`${dmSans.className} relative z-[5] bg-black text-[#f5efe4]`}>
      <div className="grid min-h-[72svh] grid-cols-1 border-t border-white/10 md:grid-cols-2 xl:grid-cols-5 xl:grid-rows-3">
        <div className="min-h-[8rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <div className="flex min-h-[8rem] flex-col justify-between gap-8 border-b border-r border-white/10 bg-black px-7 py-8 md:px-9 xl:px-10">
          <div className="space-y-2 text-[clamp(1rem,1.25vw,1.4rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-[#f7f0e5]">
            <p className="m-0">Sthyra,</p>
            <p className="m-0">Bangalore, India</p>
          </div>
          <a
            href="https://wa.me/917075747159"
            className="text-[0.92rem] font-semibold tracking-[-0.03em] text-white transition-colors duration-300 hover:text-white/72"
          >
            Whatsapp
          </a>
        </div>

        <div className="flex min-h-[8rem] items-center justify-center border-b border-r border-white/10 bg-black px-7 py-8 text-center">
          <p className="m-0 text-[clamp(1rem,1.22vw,1.4rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#f7f0e5]">
            HAVE AN IDEA?
          </p>
        </div>

        <div className="flex min-h-[8rem] flex-col justify-between border-b border-r border-white/10 bg-white px-7 py-8 text-black md:px-9 xl:px-10">
          <div>
            <p className="m-0 text-[0.66rem] uppercase tracking-[0.28em] text-black/46">
              STHYRA
            </p>
            <p className="mt-5 max-w-[12ch] text-[clamp(1.18rem,1.65vw,2rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Bangalore-based architectural immersion.
            </p>
          </div>
          <p className="m-0 max-w-[30ch] text-[0.82rem] leading-[1.65] tracking-[-0.012em] text-black/62">
            Premium visualization, cinematic renders, and interactive spatial stories.
          </p>
        </div>

        <div className="min-h-[8rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <div className="border-b border-r border-white/10 bg-white px-7 py-8 text-black md:px-9 xl:px-10">
          <div className="flex flex-col gap-4 text-[clamp(0.88rem,1vw,1.08rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            {footerNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group/footer-wave-link inline-flex w-fit text-black transition-opacity duration-300 hover:opacity-80"
              >
                <FooterWaveLabel label={item.label} />
              </Link>
            ))}
          </div>
        </div>

        <div className="min-h-[10rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />
        <div className="min-h-[10rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <Link
          href="/contact"
          className="group/start-project relative flex min-h-[14rem] flex-col justify-between border-b border-r border-white/10 bg-white px-7 py-8 text-black transition-colors duration-300 hover:bg-[#f5eee1] md:px-9 xl:px-10"
        >
          <div className="relative ml-auto h-10 w-10 overflow-hidden">
            <svg
              viewBox="0 0 64 64"
              aria-hidden="true"
              className="absolute inset-0 h-10 w-10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-5 group-hover/start-project:-translate-y-5"
            >
              <path d="M14 50L50 14M24 14H50V40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
            </svg>
            <svg
              viewBox="0 0 64 64"
              aria-hidden="true"
              className="absolute inset-0 h-10 w-10 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-0 group-hover/start-project:translate-y-0"
            >
              <path d="M14 50L50 14M24 14H50V40" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
            </svg>
          </div>
          <div>
            <p className="m-0 text-[0.66rem] uppercase tracking-[0.28em] text-black/46">
              Start a project
            </p>
            <p className="mt-6 max-w-[7ch] text-[clamp(1.7rem,2.8vw,3.2rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              LET&apos;S
              <br />
              TALK
            </p>
          </div>
        </Link>

        <div className="border-b border-r border-white/10 bg-black px-7 py-8 md:px-9 xl:px-10">
          <p className="m-0 text-[0.66rem] uppercase tracking-[0.28em] text-white/34">
            Follow
          </p>
          <div className="mt-6 flex flex-col gap-4 text-[clamp(0.88rem,1vw,1.08rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            {socialItems.map((item) => (
              <a
                key={item.label}
                href={item.link}
                className="group/footer-wave-link inline-flex w-fit text-white transition-opacity duration-300 hover:opacity-72"
              >
                <FooterWaveLabel label={item.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="border-b border-r border-white/10 bg-white px-7 py-8 text-black md:px-9 xl:px-10">
          <p className="m-0 text-[0.66rem] uppercase tracking-[0.28em] text-black/46">
            Legal
          </p>
          <div className="mt-6 flex flex-col gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-black/56">
            {footerPolicyLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors duration-300 hover:text-black">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ServicesPage() {
  const structuredData = [
    getOrganizationJsonLd(),
    getHomeServicesJsonLd(),
    getBreadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Services", url: absoluteUrl("/services") },
    ]),
  ];

  return (
    <>
      {structuredData.map((jsonLd, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
      ))}
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        menuButtonColor="#f7f7f5"
        openMenuButtonColor="#ffffff"
        changeMenuColorOnOpen
        colors={["#171717", "#0d0d0d", "#050505"]}
        logoUrl="https://cdn.sthyra.com/sthyra-labs/Images/sthyra_logo_new.png"
        accentColor="#ffffff"
        isFixed
      />

      <main className={`${dmSans.className} bg-black text-[#f5efe4]`}>
        <section className="relative isolate min-h-[48vh] overflow-hidden border-b border-white/10 bg-black">
          <ServicesHeroTiles />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0.58)_48%,rgba(0,0,0,0.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_42%,rgba(255,255,255,0.14),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:12.5vw_50vh] lg:block" />

          <div className="relative z-[2] flex min-h-[48vh] items-center justify-center px-5 py-20 text-center md:px-8 md:py-24">
            <div className="mx-auto grid max-w-[56rem] justify-items-center">
              <p className="service-hero-copy-item m-0 translate-y-4 text-[0.56rem] font-semibold uppercase tracking-[0.34em] text-white/54 opacity-0 md:text-[0.6rem]">
                Sthyra services
              </p>
              <h1 className={`${montserrat.className} service-hero-copy-item mt-4 max-w-[18ch] translate-y-4 text-balance text-[clamp(1.35rem,2.45vw,2.8rem)] font-semibold uppercase leading-[1] tracking-[-0.04em] opacity-0`}>
                Spatial systems for property launches.
              </h1>
              <p className="service-hero-copy-item mt-4 max-w-[38rem] translate-y-4 text-balance text-[clamp(0.74rem,0.82vw,0.9rem)] leading-[1.68] tracking-[-0.006em] text-white/66 opacity-0">
                Premium films, renders, interactive web, digital twins, AR, and VR for unbuilt spaces that need to be understood before they exist.
              </p>
              <div className="service-hero-copy-item mt-6 flex translate-y-4 flex-wrap justify-center gap-3 opacity-0">
                <Link
                  href="/contact"
                  className="rounded-full border border-white/20 bg-white px-5 py-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-white/82"
                >
                  Start brief
                </Link>
                <Link
                  href="#service-index"
                  className="rounded-full border border-white/16 bg-black/46 px-5 py-3 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  View services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="service-index" className="bg-black px-5 py-12 sm:px-8 md:px-10 md:py-18 lg:px-14">
          <div className="mx-auto max-w-[118rem]">
            <div
              className="site-horizontal-scroll service-work-strip -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:h-[30rem] lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {SERVICE_PAGES.map((service, index) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="service-work-card group service-hero-copy-item relative min-h-[21rem] w-[78vw] shrink-0 snap-center overflow-hidden border border-white/10 bg-white/[0.025] opacity-0 transition-[border-color,filter,flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/30 sm:w-[58vw] md:min-h-[23rem] md:w-[42vw] lg:min-h-0 lg:w-auto lg:flex-[1] lg:snap-none"
                  style={{ animationDelay: `${260 + index * 95}ms` }}
                >
                  <Image
                    src={serviceImage(index)}
                    alt={service.imagePlaceholders[0]?.imageAlt ?? service.hero.eyebrow}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover opacity-[0.78] transition duration-700 group-hover:scale-[1.045] group-hover:opacity-[0.9]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.42)_46%,rgba(0,0,0,0.9)_100%)]" />
                  <div className="absolute inset-0 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/46">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border border-white/14 bg-black/28 px-3 py-1.5 text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-white/56 backdrop-blur-xl">
                        Explore
                      </span>
                    </div>

                    <div className="absolute inset-x-5 bottom-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-focus-visible:-translate-y-3 sm:inset-x-6 sm:bottom-6">
                      <p className="m-0 text-[0.56rem] font-semibold uppercase tracking-[0.26em] text-white/52">
                        {service.hero.eyebrow}
                      </p>
                      <h2 className={`${montserrat.className} mt-4 max-w-[14ch] text-[clamp(1.02rem,1.08vw,1.32rem)] font-semibold leading-[1.02] tracking-[-0.034em] text-white`}>
                        {service.hero.eyebrow}
                      </h2>
                      <p className="mt-3 max-w-[20rem] translate-y-2 text-[0.74rem] leading-[1.5] tracking-[-0.004em] text-white/0 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/64 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:text-white/64 group-focus-visible:opacity-100">
                        {serviceSummaries[index] ?? "Premium spatial storytelling for property teams."}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black px-5 py-16 md:px-8 md:py-22">
          <div className="mx-auto max-w-[118rem]">
            <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/34">
              Strategic context
            </p>
            <div className="mt-7 grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <h2 className={`${montserrat.className} m-0 max-w-[16ch] text-[clamp(1.7rem,2.85vw,3.25rem)] font-semibold leading-[0.94] tracking-[-0.058em] text-[#f5efe4]`}>
                One system for every project touchpoint.
              </h2>
              <p className="max-w-[58rem] text-[clamp(0.82rem,0.9vw,0.96rem)] leading-[1.74] tracking-[-0.01em] text-white/58">
                A launch is rarely solved by one render, one film, or one page. Sthyra connects cinematic visuals, interactive interfaces, and immersive sales assets into a clear visual system that helps buyers, investors, architects, and sales teams understand the same future space.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black px-5 py-16 text-[#f5efe4] md:px-8 md:py-22">
          <div className="mx-auto max-w-[118rem]">
            <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/34">
              What we create
            </p>
            <div className="mt-7 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <h2 className={`${montserrat.className} m-0 max-w-[15ch] text-[clamp(1.55rem,2.35vw,2.75rem)] font-semibold leading-[0.96] tracking-[-0.052em] text-[#f5efe4]`}>
                Premium outputs for launch, sales, and buyer confidence.
              </h2>
              <div
                className="site-horizontal-scroll service-work-strip -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:h-[24rem] lg:overflow-visible lg:px-0 lg:pb-0"
              >
                {outputItems.map((item) => (
                  <article
                    key={item.title}
                    className="service-work-card group relative min-h-[18rem] w-[72vw] shrink-0 snap-center overflow-hidden border border-white/10 bg-white/[0.025] transition-[filter,flex,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/28 sm:w-[48vw] md:w-[38vw] lg:min-h-0 lg:w-auto lg:flex-[1] lg:snap-none"
                  >
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw"
                      className="object-cover opacity-[0.78] transition duration-700 group-hover:scale-[1.045] group-hover:opacity-[0.9]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.48)_48%,rgba(0,0,0,0.9)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3">
                      <p className="m-0 text-[0.56rem] font-semibold uppercase tracking-[0.26em] text-white/48">
                        Output
                      </p>
                      <h3 className="mt-3 max-w-[13ch] text-[clamp(1rem,1.08vw,1.32rem)] font-semibold leading-[1.02] tracking-[-0.034em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[18rem] translate-y-2 text-[0.74rem] leading-[1.5] tracking-[-0.004em] text-white/0 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/62 group-hover:opacity-100">
                        {item.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ServicesFooter />
      </main>
    </>
  );
}
