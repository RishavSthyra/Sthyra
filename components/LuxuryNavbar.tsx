import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "#vision", label: "Vision" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function LuxuryNavbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[40] flex justify-center px-4 pt-4 md:px-6 md:pt-6">
      <nav
        className="pointer-events-auto relative flex w-full max-w-[1080px] items-center justify-between gap-4 rounded-full border border-white/12 bg-[linear-gradient(180deg,rgba(18,18,18,0.6)_0%,rgba(7,7,7,0.44)_100%)] px-4 py-3 shadow-[0_22px_80px_rgba(0,0,0,0.42),0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-[30px] md:px-6"
        aria-label="Primary"
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_36%),linear-gradient(90deg,rgba(255,255,255,0.02),transparent_24%,transparent_76%,rgba(255,255,255,0.02))]" />
        <div className="pointer-events-none absolute inset-[1px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_45%,rgba(0,0,0,0.12)_100%)]" />
        <Link
          href="/"
          className="relative z-[1] flex min-w-0 items-center transition-transform duration-300 hover:scale-[1.01]"
        >
          <Image
            src="https://cdn.sthyra.com/sthyra-labs/Images/sthyra_logo_new.png"
            alt="STHYRA"
            width={144}
            height={40}
            className="h-9 w-auto object-contain brightness-[1.06] md:h-10"
          />
        </Link>

        <div className="relative z-[1] hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.74rem] uppercase tracking-[0.32em] text-white/72 transition-all duration-300 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="relative z-[1] flex items-center">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition-transform duration-300 hover:scale-[1.04] md:hidden"
            aria-label="Open navigation"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block h-px w-4 bg-white/88" />
              <span className="block h-px w-4 bg-white/72" />
              <span className="block h-px w-4 bg-white/88" />
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
