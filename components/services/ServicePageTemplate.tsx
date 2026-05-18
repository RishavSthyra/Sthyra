import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Montserrat } from "next/font/google";
import ServiceFaqAccordion from "@/components/services/ServiceFaqAccordion";
import ServiceOutputCards from "@/components/services/ServiceOutputCards";
import ServiceProcessRows from "@/components/services/ServiceProcessRows";
import type { ServicePageData } from "@/lib/services";

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

type ServicePageTemplateProps = {
  service: ServicePageData;
};

function getSequentialSourceColumns(totalColumns: number, visibleColumns: number) {
  const safeVisibleColumns = Math.min(totalColumns, visibleColumns);
  const startColumn = Math.max(0, Math.floor((totalColumns - safeVisibleColumns) / 2));

  return Array.from(
    { length: safeVisibleColumns },
    (_, index) => startColumn + index,
  );
}

function HeroTiles({ service }: ServicePageTemplateProps) {
  const { hero } = service;
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
                  className="object-cover scale-[1.035]"
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
                className="object-cover scale-[1.035]"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className={`${dmSans.className} bg-black text-[#f5efe4]`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative min-h-[50vh] overflow-hidden bg-black">
        <HeroTiles service={service} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.52)_48%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.1),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-0 h-full min-w-full -translate-x-1/2 [aspect-ratio:3/2] [background-size:33.333%_50%] lg:hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px)",
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block lg:[background-size:12.5vw_50vh]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.11) 1px, transparent 1px)",
            }}
          />
        </div>

        <div className="relative z-[2] flex min-h-[50vh] items-center justify-center px-5 py-24 text-center md:px-8 md:py-28">
          <div className="service-hero-copy mx-auto grid max-w-[84rem] justify-items-center">
            <p className="service-hero-copy-item m-0 translate-y-4 text-[0.52rem] font-semibold uppercase tracking-[0.34em] text-white/54 opacity-0 md:text-[0.6rem]">
              {service.hero.eyebrow}
            </p>
            <h1 className={`${montserrat.className} service-hero-copy-item mt-4 max-w-[28ch] translate-y-4 text-balance text-[clamp(1.45rem,2.85vw,3.12rem)] font-semibold leading-[0.98] tracking-[-0.056em] text-white opacity-0`}>
              {service.hero.h1}
            </h1>
            <p className="service-hero-copy-item mt-4 max-w-[76rem] translate-y-4 text-balance text-[clamp(0.72rem,0.78vw,0.88rem)] leading-[1.62] tracking-[-0.01em] text-white/70 opacity-0">
              {service.hero.description}
            </p>
            <div className="service-hero-copy-item mt-5 flex translate-y-4 flex-wrap justify-center gap-3 opacity-0">
              <Link
                href="#contact"
                className="rounded-full border border-white/20 bg-white px-4 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-white/82"
              >
                {service.hero.primaryCta}
              </Link>
              <Link
                href="#work"
                className="rounded-full border border-white/16 bg-black/46 px-4 py-2.5 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                {service.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[118rem]">
          <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/34">
            Strategic context
          </p>
          <div className="mt-7">
            <h2 className={`${montserrat.className} m-0 max-w-[15ch] text-[clamp(2rem,3.7vw,4.35rem)] font-semibold leading-[0.92] tracking-[-0.064em] text-[#f5efe4]`}>
              {service.intro.title}
            </h2>
            <p className="mt-6 max-w-[58rem] text-[clamp(0.82rem,0.9vw,0.96rem)] leading-[1.74] tracking-[-0.01em] text-white/58">
              {service.intro.body}
            </p>
          </div>
        </div>
      </section>

      <section id="work" className="bg-[#f5efe4] text-black">
        <div className="service-work-strip mx-auto grid max-w-[140rem] grid-cols-1 md:grid-cols-2 lg:flex lg:h-[34rem]">
          {service.imagePlaceholders.map((item) => (
            <article
              key={item.title}
              className="service-work-card group relative min-h-[26rem] overflow-hidden border-b border-black/10 transition-[flex,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-[28rem] md:border-r lg:min-h-0 lg:flex-[1]"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 38vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.66))] transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 md:p-8">
                <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/58">
                  {item.label}
                </p>
                <h3 className="mt-3 max-w-[19ch] text-[clamp(1.22rem,1.9vw,2.25rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[118rem]">
          <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-white/34">
            What we create
          </p>
          <div className="mt-7">
            <h2 className={`${montserrat.className} m-0 max-w-[18ch] text-[clamp(1.95rem,3.25vw,3.95rem)] font-semibold leading-[0.94] tracking-[-0.062em] text-[#f5efe4]`}>
              {service.outputsTitle ?? "Premium outputs for launch, sales, and buyer confidence."}
            </h2>
          </div>

          <ServiceOutputCards items={service.whatWeCreate} />
        </div>
      </section>

      <section className="bg-[#f5efe4] px-5 py-20 text-black md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[118rem] gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-black/42">
              Difference
            </p>
            <h2 className={`${montserrat.className} mt-8 max-w-[12ch] text-[clamp(2.2rem,4.8vw,5.7rem)] font-semibold leading-[0.88] tracking-[-0.075em]`}>
              {service.difference.title}
            </h2>
            <p className="mt-6 max-w-[48rem] text-[1rem] leading-[1.75] tracking-[-0.018em] text-black/62">
              {service.difference.body}
            </p>
          </div>
          <div className="grid content-start border-t border-black/12">
            {service.difference.bullets.map((bullet) => (
              <p
                key={bullet}
                className="m-0 border-b border-black/12 py-5 text-[clamp(1.05rem,1.5vw,1.6rem)] font-semibold leading-[1.05] tracking-[-0.045em]"
              >
                {bullet}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[118rem]">
          <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/38">
            {service.processEyebrow ?? "From Blueprint to Final Experience"}
          </p>
          <ServiceProcessRows steps={service.process} images={service.imagePlaceholders} />
        </div>
      </section>

      <section className="bg-[#f5efe4] px-5 py-20 text-black md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[118rem] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className={`${montserrat.className} m-0 max-w-[10ch] text-[clamp(2rem,4.3vw,5.1rem)] font-semibold leading-[0.9] tracking-[-0.075em]`}>
            Use cases
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {service.useCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-black/12 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/62"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[118rem] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <h2 className={`${montserrat.className} m-0 max-w-[8ch] text-[clamp(2rem,4.3vw,5.1rem)] font-semibold leading-[0.9] tracking-[-0.075em]`}>
            FAQ
          </h2>
          <ServiceFaqAccordion items={service.faq} />
        </div>
      </section>

      <section id="contact" className="bg-white px-5 py-16 text-black md:px-8 md:py-20">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-black/42">
              Start a project
            </p>
            <h2 className={`${montserrat.className} mt-5 max-w-[11ch] text-[clamp(2.2rem,5.2vw,6rem)] font-semibold leading-[0.86] tracking-[-0.078em]`}>
              {service.contactTitle ?? "Create your project experience."}
            </h2>
          </div>
          <Link
            href={`https://wa.me/917075747159`}
            className="w-fit rounded-full border border-black/14 bg-black px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-black/78"
          >
            Whatsapp
          </Link>
        </div>
      </section>
    </main>
  );
}
