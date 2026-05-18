"use client";

import Image from "next/image";
import Link from "next/link";

function EditorialLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-[0.6rem] font-semibold uppercase tracking-[0.38em] text-white/38">
      {children}
    </p>
  );
}

function AnimatedTitle({ className }: { className?: string }) {
  return (
    <h1 className={`${className} legal-hero-title text-center`}>
      <span className="block">Terms That Keep</span>
      <span className="block">Projects Clear</span>
    </h1>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black px-5 py-8 sm:px-8 md:px-10 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-white/32">
            Sthyra Register 2026 &reg;
          </p>
          <span className="hidden text-white/20 sm:inline">|</span>
          <Link
            href="/privacy-policy"
            className="text-[0.6rem] uppercase tracking-[0.22em] text-white/32 transition-colors duration-300 hover:text-white/60"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-black text-[#f7f1e7]">
      <section className="relative isolate overflow-hidden border-b border-white/8">
        <Image
          src="/images_last_frame.jpg"
          alt="Sthyra architectural visualization scene"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.16] grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" />

        <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 md:px-12 lg:px-16">
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
            className="border border-white/14 bg-white/4 px-5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-white/72 transition-all duration-300 hover:border-white/30 hover:text-white"
          >
            Home
          </Link>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[68svh] flex-col items-center justify-center px-6 py-20 text-center sm:max-w-4xl sm:px-8 md:max-w-3xl md:px-10 lg:max-w-5xl lg:px-12">
          <EditorialLabel>Terms & Conditions</EditorialLabel>
          <AnimatedTitle
            className="mt-7 max-w-[15ch] text-[clamp(1.9rem,4.6vw,3.9rem)] font-semibold uppercase leading-[0.92] tracking-[-0.045em]"
          />
          <p className="mx-auto mt-7 max-w-lg text-[0.98rem] leading-[1.65] tracking-[-0.01em] text-white/56 sm:max-w-xl sm:text-[1.04rem]">
            These terms outline the rules, rights, and responsibilities governing your use of the Sthyra website and services. Please read carefully before engaging with our platform.
          </p>
          <p className="mt-6 text-[0.6rem] uppercase tracking-[0.3em] text-white/28">
            Last updated: May 2026
          </p>
        </div>
      </section>

      <section className="bg-black px-5 py-14 sm:px-8 sm:py-18 md:px-10 md:py-22 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[13rem_1fr] md:gap-16 lg:grid-cols-[15rem_1fr] lg:gap-20">
            <aside className="legal-sidebar md:sticky md:top-8 md:max-h-[calc(100svh-4rem)] md:self-start md:overflow-y-auto md:pr-2">
              <EditorialLabel>Contents</EditorialLabel>
              <nav className="mt-5 space-y-2 sm:space-y-3">
                <a href="#section-01" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">01</span>
                  <span>Agreement to Terms</span>
                </a>
                <a href="#section-02" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">02</span>
                  <span>Services Overview</span>
                </a>
                <a href="#section-03" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">03</span>
                  <span>Intellectual Property</span>
                </a>
                <a href="#section-04" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">04</span>
                  <span>Project Engagements</span>
                </a>
                <a href="#section-05" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">05</span>
                  <span>Client Responsibilities</span>
                </a>
                <a href="#section-06" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">06</span>
                  <span>Payment Terms</span>
                </a>
                <a href="#section-07" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">07</span>
                  <span>Confidentiality</span>
                </a>
                <a href="#section-08" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">08</span>
                  <span>Limitation of Liability</span>
                </a>
                <a href="#section-09" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">09</span>
                  <span>Website Usage</span>
                </a>
                <a href="#section-10" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">10</span>
                  <span>Indemnification</span>
                </a>
                <a href="#section-11" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">11</span>
                  <span>Termination</span>
                </a>
                <a href="#section-12" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">12</span>
                  <span>Governing Law</span>
                </a>
                <a href="#section-13" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">13</span>
                  <span>Dispute Resolution</span>
                </a>
                <a href="#section-14" className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]">
                  <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">14</span>
                  <span>Contact Information</span>
                </a>
              </nav>
              <div className="mt-10 border-t border-white/10 pt-8">
                <EditorialLabel>Legal</EditorialLabel>
                <p className="mt-4 text-[0.85rem] leading-relaxed text-white/50">
                  Questions about these terms can be sent to{" "}
                  <a href="mailto:info@sthyra.com" className="text-white/75 underline underline-offset-2 transition-colors duration-300 hover:text-white">
                    info@sthyra.com
                  </a>
                </p>
              </div>
              <div className="mt-8">
                <Link href="/privacy-policy" className="inline-flex items-center gap-2 text-[0.78rem] text-white/40 transition-colors duration-300 hover:text-white/80">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Privacy Policy
                </Link>
              </div>
            </aside>

            <div className="space-y-14">
              <article id="section-01" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">01</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Agreement to Terms</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    By accessing or using the Sthyra website, chatbot, contact forms, or engaging with our services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    If you do not agree with any part of these terms, you must not use our website or services. Your continued use of our platform constitutes your acceptance of these terms.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    These terms apply to all visitors, users, clients, and others who access our website or engage with our services in any capacity.
                  </p>
                </div>
              </article>

              <article id="section-02" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">02</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Services Overview</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Sthyra is an architectural visualization and design studio providing services including but not limited to architectural rendering, 3D visualization, walkthrough animations, virtual staging, and design consultation.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    The specific scope, timeline, deliverables, and pricing for any project will be outlined in a separate project proposal or contract agreed upon by both parties.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
                  </p>
                </div>
              </article>

              <article id="section-03" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">03</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Intellectual Property</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    All content, materials, designs, visualizations, renders, animations, code, logos, trademarks, and intellectual property displayed on the Sthyra website are owned by Sthyra or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Upon full payment for project deliverables, clients receive a license to use the final commissioned works for their intended purpose as specified in the project agreement. Sthyra retains the right to display completed works in our portfolio unless otherwise agreed in writing.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Clients must ensure they have the necessary rights to all materials, drawings, blueprints, and references provided to Sthyra for project work. Clients indemnify Sthyra against any claims arising from materials provided.
                  </p>
                </div>
              </article>

              <article id="section-04" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">04</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Project Engagements</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Project engagements begin upon receipt of a signed proposal and deposit payment. The proposal outlines the project scope, deliverables, timeline, and fees.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Any changes to the project scope after work has commenced may result in additional fees and timeline adjustments. We will communicate any changes and obtain your approval before proceeding.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Clients are expected to provide timely feedback and approvals. Delays in client feedback or decision-making may impact project timelines, and additional charges may apply for extended timelines.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    A defined number of revision rounds will be included in each project proposal. Additional revisions beyond this scope will be billed at our standard hourly rate.
                  </p>
                </div>
              </article>

              <article id="section-05" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">05</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Client Responsibilities</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Clients are responsible for providing accurate, complete, and timely information necessary for project execution, including architectural drawings, design references, material specifications, and project requirements.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Clients must ensure they have the legal right to use and share all materials provided to Sthyra, including floor plans, site surveys, reference images, and brand assets.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Clients are expected to communicate clearly and promptly, attend scheduled meetings or calls, and provide feedback within agreed-upon timeframes to ensure project success.
                  </p>
                </div>
              </article>

              <article id="section-06" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">06</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Payment Terms</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    A deposit of 50% of the project total is required to commence work. The remaining balance is due upon project completion and before final deliverables are delivered.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    For projects under a specified threshold, full payment may be required upfront. Payment terms for larger or ongoing engagements will be outlined in individual project agreements.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Invoices are payable within 15 days of issuance. Late payments may incur interest at a rate of 1.5% per month on the outstanding balance.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    All fees are quoted in Indian Rupees (INR) unless otherwise specified. International transactions may be subject to currency conversion fees and bank processing charges.
                  </p>
                </div>
              </article>

              <article id="section-07" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">07</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Confidentiality</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Both parties agree to maintain the confidentiality of proprietary or sensitive information shared during the course of project engagement. This includes but is not limited to business plans, financial information, design concepts, and technical specifications.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Confidential information does not include information that is publicly available, independently developed, or rightfully obtained from third parties without restriction.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Our obligation to maintain confidentiality survives the termination of our business relationship for a period of two (2) years.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Notwithstanding the above, Sthyra retains the right to display completed project works in our portfolio and marketing materials unless the client has executed a separate non-disclosure agreement.
                  </p>
                </div>
              </article>

              <article id="section-08" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">08</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Limitation of Liability</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    To the maximum extent permitted by law, Sthyra shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, revenue, data, or business opportunities, arising from your use of our website or services.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Our total liability for any claims arising from or related to our services shall not exceed the total amount paid by the client for the specific project giving rise to the claim.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    We make no warranties, express or implied, regarding the accuracy, reliability, or suitability of our services. All deliverables are provided on an &ldquo;as is&rdquo; basis.
                  </p>
                </div>
              </article>

              <article id="section-09" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">09</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Website Usage</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    You agree to use our website only for lawful purposes and in accordance with these terms. You shall not use our website in any way that violates applicable laws or regulations.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    You agree not to: (a) attempt to gain unauthorized access to our systems or user accounts; (b) interfere with or disrupt the website or servers; (c) transmit any viruses, malware, or harmful code; (d) collect user information without consent; or (e) engage in any activity that imposes an unreasonable load on our infrastructure.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    We reserve the right to terminate or suspend access to our website for users who violate these terms, without prior notice.
                  </p>
                </div>
              </article>

              <article id="section-10" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">10</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Indemnification</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    You agree to indemnify, defend, and hold harmless Sthyra, our directors, employees, contractors, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from your violation of these terms or your misuse of our website and services.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    This includes but is not limited to claims arising from inaccurate information you provide, infringement of third-party intellectual property rights, or any illegal activity conducted through your account.
                  </p>
                </div>
              </article>

              <article id="section-11" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">11</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Termination</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    Either party may terminate a project engagement with 14 days written notice. Upon termination, the client shall pay for all work completed up to the termination date.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    If termination occurs before project completion, the client will receive all completed deliverables. Incomplete deliverables or works-in-progress will be provided at our discretion and subject to payment.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    We reserve the right to terminate any engagement immediately if the client breaches these terms, fails to make payments on schedule, or engages in illegal, unethical, or harassing behavior.
                  </p>
                </div>
              </article>

              <article id="section-12" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">12</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Governing Law</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these terms shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    The United Nations Convention on Contracts for the International Sale of Goods (CISG) does not apply to these terms.
                  </p>
                </div>
              </article>

              <article id="section-13" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">13</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Dispute Resolution</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    We are committed to resolving disputes amicably and efficiently. If a dispute arises, both parties agree to first attempt to resolve the issue through direct negotiation.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    If direct negotiation fails within 30 days, either party may request mediation through a mutually agreed-upon mediation service. Mediation costs will be shared equally.
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    If mediation fails, the dispute shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India.
                  </p>
                </div>
              </article>

              <article id="section-14" className="scroll-mt-28">
                <div className="flex items-baseline gap-4">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">14</span>
                  <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Contact Information</h2>
                </div>
                <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    If you have any questions or concerns about these Terms and Conditions, please contact us at:
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    <strong className="font-medium text-white/70">Email:</strong>{" "}
                    <a href="mailto:info@sthyra.com" className="text-white/75 transition-colors hover:text-white">
                      info@sthyra.com
                    </a>
                  </p>
                  <p className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]">
                    We aim to respond to all inquiries within 3-5 business days.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
