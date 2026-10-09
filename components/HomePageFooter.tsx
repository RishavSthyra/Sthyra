"use client";

import Link from "next/link";
import { Open_Sans } from "next/font/google";
import { FiArrowUpRight } from "react-icons/fi";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "optional",
});

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Reasons", href: "/#reasons" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/sthyrastudios?stkn=OGF3dzJudWc5c211",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/sthyra/?originalSubdomain=in",
  },
];

const policies = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms & conditions", href: "/terms-and-conditions" },
];

function WaveLabel({ label }: { label: string }) {
  const characters = Array.from(label);

  return (
    <span className="relative inline-flex overflow-hidden align-top">
      <span aria-hidden="true" className="inline-flex">
        {characters.map((character, index) => (
          <span
            key={`top-${label}-${index}`}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [will-change:transform] group-hover/footer-wave-link:-translate-y-[115%]"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0 inline-flex">
        {characters.map((character, index) => (
          <span
            key={`bottom-${label}-${index}`}
            className="inline-block translate-y-[115%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [will-change:transform] group-hover/footer-wave-link:translate-y-0"
            style={{ transitionDelay: `${index * 18}ms` }}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function EditorialLabel({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <p
      className={`m-0 text-[0.66rem] uppercase tracking-[0.28em] ${
        light ? "text-black/46" : "text-white/42"
      }`}
    >
      {children}
    </p>
  );
}

function AnimatedArrow() {
  return (
    <span className="relative grid h-12 w-12 overflow-hidden place-items-center">
      <FiArrowUpRight className="absolute h-10 w-10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-5 group-hover/start-project:-translate-y-5" />
      <FiArrowUpRight className="absolute h-10 w-10 -translate-x-5 translate-y-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/start-project:translate-x-0 group-hover/start-project:translate-y-0" />
    </span>
  );
}

function DesktopFooter() {
  return (
    <div className="hidden min-[1100px]:block">
      <div className="grid min-h-[100svh] grid-cols-5 grid-rows-3 border-t border-white/10">
        <div className="min-h-[9rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <div className="flex min-h-[9rem] flex-col justify-between gap-10 border-b border-r border-white/10 bg-black px-11 py-12">
          <div className="space-y-2 text-[clamp(1rem,1.35vw,1.52rem)] font-semibold leading-[1.08] tracking-[-0.05em] text-[#f7f0e5]">
            <p className="m-0">Sthyra,</p>
            <p className="m-0">Bangalore, India</p>
          </div>
          <a
            href="https://wa.me/917075747159"
            className="text-[clamp(0.86rem,0.95vw,1.05rem)] font-semibold tracking-[-0.03em] text-white transition-colors duration-300 hover:text-white/72"
          >
            Whatsapp
          </a>
        </div>

        <div className="flex min-h-[9rem] items-center justify-center border-b border-r border-white/10 bg-black px-8 py-10 text-center">
          <p className="m-0 text-[clamp(1.08rem,1.38vw,1.62rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#f7f0e5]">
            HAVE AN IDEA?
          </p>
        </div>

        <div className="flex min-h-[9rem] flex-col justify-between border-b border-r border-white/10 bg-white px-11 py-12 text-black">
          <div>
            <p className="m-0 text-[0.72rem] uppercase tracking-[0.28em] text-black/46">STHYRA</p>
            <p className="mt-5 max-w-[12ch] text-[clamp(1.32rem,1.82vw,2.22rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
              Bangalore-based architectural immersion.
            </p>
          </div>
          <p className="m-0 max-w-[30ch] text-[clamp(0.78rem,0.82vw,0.88rem)] leading-[1.65] tracking-[-0.012em] text-black/62">
            Premium visualization, cinematic renders, and interactive spatial stories.
          </p>
        </div>

        <div className="min-h-[9rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <div className="border-b border-r border-white/10 bg-white px-11 py-12 text-black">
          <div className="flex flex-col gap-4 text-[clamp(0.88rem,1.02vw,1.12rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group/footer-wave-link inline-flex w-fit text-black transition-opacity duration-300 hover:opacity-80"
              >
                <WaveLabel label={item.label} />
              </Link>
            ))}
          </div>
        </div>

        <div className="min-h-[12rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />
        <div className="min-h-[12rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <a
          href="https://wa.me/917075747159"
          className="group/start-project relative flex min-h-[16rem] flex-col justify-between border-b border-r border-white/10 bg-white px-11 py-12 text-black transition-colors duration-300 hover:bg-[#f5eee1]"
        >
          <div className="ml-auto"><AnimatedArrow /></div>
          <div>
            <p className="m-0 text-[0.72rem] uppercase tracking-[0.28em] text-black/46">Start a project</p>
            <p className="mt-6 max-w-[7ch] text-[clamp(1.95rem,3.35vw,3.65rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
              LET&apos;S<br />TALK
            </p>
          </div>
        </a>

        <div className="min-h-[12rem] border-b border-r border-white/10 bg-black" aria-hidden="true" />

        <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-11 py-8">
          <p className="m-0 text-[clamp(0.84rem,0.92vw,0.98rem)] leading-[1.3] tracking-[-0.02em] text-white/90">©2026 Sthyra</p>
        </div>

        <div className="border-b border-r border-white/10 bg-white px-11 py-12 text-black">
          <div className="flex flex-col gap-4 text-[clamp(0.88rem,0.98vw,1.08rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group/footer-wave-link inline-flex w-fit text-black transition-opacity duration-300 hover:opacity-80"
              >
                <WaveLabel label={item.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-11 py-8">
          <p className="m-0 max-w-[18ch] text-[clamp(0.84rem,0.9vw,0.98rem)] leading-[1.3] tracking-[-0.02em] text-white/90">
            Built for unbuilt spaces. Designed to help people see the future sooner.
          </p>
        </div>

        <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-11 py-8">
          <p className="m-0 text-[clamp(0.84rem,0.9vw,0.98rem)] leading-[1.3] tracking-[-0.02em] text-white/90">Made in Bangalore</p>
        </div>

        <div className="flex min-h-[9rem] items-end border-b border-r border-white/10 bg-black px-11 py-8">
          <div className="flex flex-col gap-3 text-[clamp(0.84rem,0.9vw,0.98rem)] leading-[1.25] tracking-[-0.02em] text-white/90">
            {policies.map((item) => (
              <Link key={item.label} href={item.href} className="w-fit transition-colors duration-300 hover:text-white/64">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileFooter() {
  return (
    <div className="min-[1100px]:hidden">
      <div className="grid gap-0 md:grid-cols-[1.08fr_0.92fr]">
        <div className="border-b border-white/10 px-4 py-8 sm:px-6 md:px-8 md:py-10">
          <EditorialLabel>Contact</EditorialLabel>
          <h3 className="mt-5 max-w-[12ch] text-balance text-[clamp(2.25rem,10.5vw,4.1rem)] font-semibold leading-[0.84] tracking-[-0.078em] text-[#f7f1e7] md:max-w-[11ch] md:text-[clamp(2.7rem,4.5vw,4.7rem)]">
            Bangalore architectural immersion.
          </h3>
          <p className="mt-6 max-w-[31ch] text-[0.96rem] leading-[1.55] tracking-[-0.014em] text-white/62 md:max-w-[38ch] md:text-[1.02rem]">
            Premium visualization, cinematic renders, and interactive spatial stories for unbuilt spaces.
          </p>
        </div>

        <a
          href="https://wa.me/917075747159"
          className="group/start-project flex min-h-[16rem] flex-col justify-between border-b border-white/10 bg-[#f4efe7] px-4 py-7 text-black transition-colors duration-300 hover:bg-white sm:px-6 md:min-h-0 md:px-8 md:py-10"
        >
          <div className="flex items-start justify-between gap-4">
            <EditorialLabel light>Start a project</EditorialLabel>
            <div className="grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center overflow-hidden rounded-full border border-black/14 text-black md:h-14 md:w-14">
              <AnimatedArrow />
            </div>
          </div>
          <h3 className="mt-10 max-w-[7ch] text-[clamp(3rem,14vw,5.4rem)] font-semibold uppercase leading-[0.8] tracking-[-0.08em] md:text-[clamp(3.4rem,5.4vw,5.6rem)]">
            LET&apos;S<br />TALK
          </h3>
        </a>
      </div>

      <div className="grid md:grid-cols-3">
        <FooterList title="Navigation" items={navigation} />
        <FooterList title="Social" items={socials} external />
        <FooterList title="Policy" items={policies} />
      </div>

      <div className="flex flex-col gap-2 px-4 py-5 text-[0.86rem] tracking-[-0.01em] text-white/56 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="m-0">©2026 Sthyra</p>
        <p className="m-0">info@sthyra.com</p>
        <p className="m-0">Bangalore, India</p>
      </div>
    </div>
  );
}

function FooterList({
  title,
  items,
  external = false,
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
  external?: boolean;
}) {
  return (
    <div className="border-b border-white/10 px-4 py-5 sm:px-6 md:border-r md:px-8">
      <EditorialLabel>{title}</EditorialLabel>
      <div className="mt-4 grid gap-3 text-[1rem] font-semibold tracking-[-0.03em] text-[#f7f1e7]">
        {items.map((item) =>
          external ? (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="transition-colors duration-300 hover:text-white/72">
              {item.label}
            </a>
          ) : (
            <Link key={item.label} href={item.href} className="transition-colors duration-300 hover:text-white/72">
              {item.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export default function HomePageFooter() {
  return (
    <footer
      id="contact"
      className={`${openSans.className} relative z-[5] border-t border-white/10 bg-black text-[#f5efe4]`}
    >
      <DesktopFooter />
      <MobileFooter />
    </footer>
  );
}
