import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Sthyra",
  description:
    "Contact Sthyra for premium architectural visualization, cinematic real estate films, ultra-real renders, interactive web experiences, digital twins, VR, AR, and pixel streaming.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Sthyra",
    description:
      "Share your real estate visualization brief with Sthyra's Bangalore-based architectural storytelling studio.",
    url: "/contact",
    images: [
      {
        url: absoluteUrl("/images_last_frame.jpg"),
        width: 1200,
        height: 630,
        alt: "Sthyra architectural visualization contact page",
      },
    ],
  },
};

const FOOTER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms & conditions", href: "/terms-and-conditions" },
];

const FOOTER_SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://twitter.com" },
];

function EditorialLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={[
        "m-0 text-[0.62rem] font-semibold uppercase tracking-[0.32em]",
        light ? "text-black/42" : "text-white/38",
      ].join(" ")}
    >
      {children}
    </p>
  );
}

function FooterArrowIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-11 w-11">
      <path
        d="M14 50L50 14M24 14H50V40"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ContactFooter() {
  return (
    <footer className="relative z-[5] bg-black text-[#f5efe4]">
      <div className="grid border-t border-white/10 md:grid-cols-2 xl:grid-cols-5">
        <div className="hidden min-h-[9rem] border-b border-r border-white/10 bg-black xl:block" aria-hidden="true" />

        <div className="flex min-h-[12rem] flex-col justify-between gap-8 border-b border-r border-white/10 bg-black px-6 py-8 md:px-8 xl:px-10">
          <div className="space-y-2 text-[clamp(1.05rem,1.5vw,1.6rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#f7f0e5]">
            <p className="m-0">Sthyra,</p>
            <p className="m-0">Bangalore, India</p>
          </div>
          <a
            href="mailto:info@sthyra.com"
            className="w-fit text-[0.95rem] font-semibold tracking-[-0.03em] text-white transition-colors duration-300 hover:text-white/72"
          >
            info@sthyra.com
          </a>
        </div>

        <div className="flex min-h-[12rem] items-center justify-center border-b border-r border-white/10 bg-black px-6 py-8 text-center md:px-8">
          <p className="m-0 text-[clamp(1.12rem,1.5vw,1.72rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#f7f0e5]">
            HAVE A SITE?
          </p>
        </div>

        <div className="flex min-h-[12rem] flex-col justify-between border-b border-r border-white/10 bg-white px-6 py-8 text-black md:px-8 xl:px-10">
          <div>
            <p className="m-0 text-[0.68rem] uppercase tracking-[0.28em] text-black/46">
              STHYRA
            </p>
            <p className="mt-5 max-w-[12ch] text-[clamp(1.38rem,2vw,2.32rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
              Architectural immersion for unbuilt spaces.
            </p>
          </div>
          <p className="m-0 max-w-[30ch] text-[0.82rem] leading-[1.6] tracking-[-0.012em] text-black/62">
            Premium visualization, cinematic renders, and interactive spatial stories.
          </p>
        </div>

        <a
          href="https://wa.me/917075747159"
          className="group/start-project relative flex min-h-[12rem] flex-col justify-between border-b border-r border-white/10 bg-white px-6 py-8 text-black transition-colors duration-300 hover:bg-[#f5eee1] md:px-8 xl:px-10"
        >
          <div className="relative ml-auto h-11 w-11 overflow-hidden">
            <span className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-5 group-hover/start-project:-translate-y-5">
              <FooterArrowIcon />
            </span>
            <span className="absolute inset-0 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-0 group-hover/start-project:translate-y-0">
              <FooterArrowIcon />
            </span>
          </div>
          <div>
            <p className="m-0 text-[0.68rem] uppercase tracking-[0.28em] text-black/46">
              Start a project
            </p>
            <p className="mt-5 max-w-[7ch] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
              LET&apos;S
              <br />
              TALK
            </p>
          </div>
        </a>

        <div className="border-b border-r border-white/10 bg-white px-6 py-8 text-black md:px-8 xl:px-10">
          <div className="flex flex-col gap-4 text-[clamp(0.9rem,1.02vw,1.12rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            {FOOTER_NAV_LINKS.map((item) => (
              <Link key={item.label} href={item.href} className="w-fit transition-opacity duration-300 hover:opacity-70">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden min-h-[12rem] border-b border-r border-white/10 bg-black xl:block" aria-hidden="true" />
        <div className="hidden min-h-[12rem] border-b border-r border-white/10 bg-black xl:block" aria-hidden="true" />

        <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-6 py-7 md:px-8 xl:px-10">
          <p className="m-0 text-[0.9rem] leading-[1.3] tracking-[-0.02em] text-white/90">
            ©2026 Sthyra
          </p>
        </div>

        <div className="border-b border-r border-white/10 bg-white px-6 py-8 text-black md:px-8 xl:px-10">
          <div className="flex flex-col gap-4 text-[0.98rem] font-semibold leading-[1.02] tracking-[-0.04em]">
            {FOOTER_SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="w-fit transition-opacity duration-300 hover:opacity-70"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-6 py-7 md:px-8 xl:px-10">
          <p className="m-0 max-w-[18ch] text-[0.9rem] leading-[1.3] tracking-[-0.02em] text-white/90">
            Built for unbuilt spaces. Designed to help people see the future sooner.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-[#f7f1e7]">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <Image
          src="/images_last_frame.jpg"
          alt="Premium architectural visualization scene"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.42] grayscale"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.66)_44%,rgba(0,0,0,0.92)_100%),linear-gradient(180deg,rgba(0,0,0,0.34)_0%,#000_100%)]" />

        <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-6 md:px-8">
          <Link href="/" aria-label="Go to Sthyra home" className="relative h-9 w-[8.6rem]">
            <Image
              src="/sthyra_logo_new.png"
              alt="Sthyra"
              fill
              sizes="140px"
              className="object-contain object-left brightness-125"
            />
          </Link>
          <Link
            href="/"
            className="border border-white/14 bg-white/[0.04] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/72 transition-colors duration-300 hover:border-white/28 hover:text-white"
          >
            Home
          </Link>
        </header>

        <div className="relative z-10 grid min-h-[calc(100svh-5rem)] content-end px-4 pb-8 pt-10 sm:px-6 md:px-8 md:pb-10 lg:content-center">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(28rem,0.54fr)] lg:items-center">
            <div className="contact-hero-copy max-w-[50rem]">
              <EditorialLabel>Private project intake</EditorialLabel>
              <h1 className="mt-5 max-w-[9ch] text-[clamp(3.65rem,13.6vw,9.2rem)] font-semibold uppercase leading-[0.79] tracking-[-0.08em] text-[#f7f1e7]">
                Shape the brief.
              </h1>
              <p className="mt-6 max-w-[34rem] text-[clamp(0.98rem,1.55vw,1.18rem)] leading-[1.55] tracking-[-0.02em] text-white/66">
                Tell us what you are building, what needs to be sold or approved, and how soon
                the visual system has to move.
              </p>
            </div>

            <div className="contact-form-card w-full max-w-[42rem] justify-self-end border border-white/[0.1] bg-black/72 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-5">
              <div className="mb-4 grid gap-2 border-b border-white/[0.1] pb-4">
                <EditorialLabel>Required fields</EditorialLabel>
                <p className="m-0 max-w-[28rem] text-[0.82rem] leading-[1.55] tracking-[-0.012em] text-white/56">
                  Share enough context for a precise response. We usually reply within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}
