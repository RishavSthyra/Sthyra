"use client";

import Image from "next/image";
import Link from "next/link";

const POLICY_SECTIONS = [
  {
    title: "Information We Collect",
    body: [
      "When you contact Sthyra, we may collect your name, email address, phone number, company name, project type, budget range, timeline, service interest, project brief, and any additional details you choose to share through our inquiry forms or chatbot.",
      "When you engage with our chatbot, we may store your messages, assistant replies, detected intent, service interest, lead quality signals, page URL, user agent, device type, and timestamp. This data helps our team understand your needs and provide relevant follow-up.",
      "We also collect information through analytics tools, including pages visited, time spent on site, click patterns, referral sources, and general geographic location data derived from IP addresses.",
      "If you subscribe to our newsletter or opt-in to communications, we may collect your email preferences and engagement history with our communications.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use submitted information to respond to inquiries, understand project requirements, prepare consultation materials, improve our services, and maintain professional communication with potential and existing clients.",
      "Your project details and preferences help us tailor our initial consultations and present relevant case studies, capabilities, and approach descriptions that align with your vision.",
      "We may use aggregated, non-personally identifiable patterns to improve website experience, chatbot responses, service positioning, and lead qualification processes.",
      "Communication preferences are used solely to deliver the content you have requested, and you may update these preferences at any time.",
    ],
  },
  {
    title: "Contact Forms And Chatbot Data",
    body: [
      "Contact form submissions are transmitted securely to Sthyra through server-side workflows. These submissions are reviewed by our team and used to initiate client conversations.",
      "Chatbot interactions may be passed to automation tools such as Zapier, Google Sheets, and our CRM system so our team can efficiently review and respond to client needs.",
      "All data transmission occurs over encrypted connections (TLS/HTTPS), and we limit access to inquiry data to authorized team members only.",
      "Please avoid submitting confidential architectural plans, financial documents, legal documents, passwords, national identification numbers, or other highly sensitive personal information through the chatbot or contact form unless we have explicitly agreed on a secure transfer method.",
    ],
  },
  {
    title: "Analytics And Advertising",
    body: [
      "Sthyra uses analytics and advertising tools, including Google Analytics, Google Tag Manager, and Meta Pixel, to understand site performance, campaign activity, page engagement, and conversion events.",
      "These tools collect information such as pages viewed, session duration, bounce rate, referral channels, device type, browser type, and approximate geographic location based on IP address.",
      "Analytics data is aggregated and does not identify individual users unless they voluntarily provide identifying information through a form submission or chatbot conversation.",
      "These tools may use cookies, device identifiers, browser fingerprints, and interaction signals according to their own privacy policies. We encourage you to review the privacy policies of these third-party providers.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "Cookies and similar tracking technologies are used to keep the website functional, measure performance, support advertising attribution, and improve browsing quality.",
      "Essential cookies are required for basic website functionality and do not require consent. These include session cookies, security cookies, and load-balancing cookies.",
      "Performance and analytics cookies help us understand how visitors interact with our website by collecting anonymous usage data.",
      "Marketing cookies may be used to deliver relevant advertisements based on your browsing behavior across websites. These cookies require your explicit consent.",
      "You can control or delete cookies through your browser settings or our cookie consent management platform. Some website features may not function properly if cookies are disabled.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "We use trusted third-party services to operate our website and manage client communications, including hosting providers, email delivery services, CRM platforms, and analytics tools.",
      "These service providers are contractually obligated to handle your data securely and only for the purposes we specify. They are prohibited from using your information for their own marketing or unrelated purposes.",
      "Our website may include links to third-party websites, social media platforms, or embedded content from external sources. We are not responsible for the privacy practices of these external services.",
      "When you interact with social media features or share content from our website, the respective social media platform may collect information according to their own privacy policies.",
    ],
  },
  {
    title: "Sharing Of Information",
    body: [
      "We do not sell, rent, or trade personal information to third parties for marketing purposes. Your data is used exclusively for the purposes described in this policy.",
      "We may share limited information with trusted service providers who help operate the website, process inquiries, manage automation workflows, send emails, host data, or measure analytics.",
      "In the event of a business transfer, merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. We will notify you via email or prominent notice on our website before your information becomes subject to a different privacy policy.",
      "We may disclose information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, ensure website security, or prevent fraudulent or illegal activity.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We retain inquiry and chatbot data for as long as necessary to respond to your request, manage client relationships, evaluate business opportunities, maintain accurate records, and improve our services.",
      "Analytics data is typically retained for a period of 26 months, after which it is anonymized or deleted in accordance with our data retention schedule.",
      "Contact form submissions and email communications may be retained indefinitely as part of our business records, unless you specifically request deletion.",
      "If you want your inquiry data deleted or corrected, contact us at info@sthyra.com. We will respond to your request within 30 days.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We implement reasonable technical and organizational measures to protect information submitted through the website, including SSL/TLS encryption, secure hosting, access controls, and regular security assessments.",
      "Our team follows established data handling procedures and is trained on privacy best practices. Access to personal information is limited to authorized personnel who require it for legitimate business purposes.",
      "While we strive to protect your information, no internet-based system, mobile application, or electronic storage method is completely secure. We cannot guarantee absolute security.",
      "If you become aware of a potential data breach, please contact us immediately at info@sthyra.com so we can take appropriate action.",
    ],
  },
  {
    title: "International Data Transfers",
    body: [
      "Sthyra is headquartered and operates primarily within India. If you are located outside this region, please note that your information will be transferred to and processed in India, which may have different data protection laws than your country of residence.",
      "When we transfer data internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses or equivalent legal mechanisms, to protect your information.",
      "By submitting your information to us, you consent to its transfer, storage, and processing in accordance with this policy.",
    ],
  },
  {
    title: "Your Rights And Choices",
    body: [
      "You have the right to request access to the personal information we hold about you, receive a copy in a portable format, and understand how it is being used.",
      "You may request correction of inaccurate or incomplete information by contacting us at info@sthyra.com.",
      "You may request deletion of your personal information, subject to certain legal exceptions for data we are required to retain for regulatory or contractual purposes.",
      "You may unsubscribe from marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.",
      "You may lodge a complaint with your local data protection authority if you believe your privacy rights have been violated.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.",
      "If we become aware that we have inadvertently collected information from a child without parental consent, we will take steps to delete that information as soon as possible.",
      "Parents or guardians who believe their child has provided us with personal information should contact us at info@sthyra.com.",
    ],
  },
  {
    title: "Policy Updates",
    body: [
      "We may update this privacy policy periodically to reflect changes in our practices, services, automation tools, legal requirements, or technological advancements.",
      "When we make material changes to this policy, we will update the 'Last updated' date at the top of this page and, for significant changes, provide prominent notice on our website or direct email notification.",
      "We encourage you to review this policy periodically to stay informed about how we protect your information.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us at info@sthyra.com.",
      "For general inquiries about our services, project opportunities, or partnership proposals, you may also reach us through our contact form or chatbot.",
      "We aim to respond to all legitimate inquiries within 3-5 business days.",
    ],
  },
];

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
      <span className="block">Data Handled With</span>
      <span className="block">Clear Intent</span>
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
            href="/terms-and-conditions"
            className="text-[0.6rem] uppercase tracking-[0.22em] text-white/32 transition-colors duration-300 hover:text-white/60"
          >
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function PrivacyPolicyPage() {
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
          <EditorialLabel>Privacy Policy</EditorialLabel>
          <AnimatedTitle
            className="mt-7 max-w-[17ch] text-[clamp(1.9rem,4.6vw,3.9rem)] font-semibold uppercase leading-[0.92] tracking-[-0.045em]"
          />
          <p className="mx-auto mt-7 max-w-lg text-[0.98rem] leading-[1.65] tracking-[-0.01em] text-white/56 sm:max-w-xl sm:text-[1.04rem]">
            This policy explains how Sthyra collects, uses, stores, and protects information submitted through our website, chatbot, contact forms, analytics, and project workflows.
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
                {POLICY_SECTIONS.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#section-${index + 1}`}
                    className="group flex items-start gap-3 py-1 text-[0.78rem] leading-relaxed text-white/40 transition-colors duration-300 hover:text-white/80 sm:text-[0.82rem]"
                  >
                    <span className="mt-[0.1rem] text-[0.58rem] font-medium text-white/20 transition-colors duration-300 group-hover:text-white/40 sm:text-[0.6rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </a>
                ))}
              </nav>
              <div className="mt-10 border-t border-white/10 pt-8">
                <EditorialLabel>Contact</EditorialLabel>
                <p className="mt-4 text-[0.85rem] leading-relaxed text-white/50">
                  Questions about data or requests can be sent to{" "}
                  <a
                    href="mailto:info@sthyra.com"
                    className="text-white/75 underline underline-offset-2 transition-colors duration-300 hover:text-white"
                  >
                    info@sthyra.com
                  </a>
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/terms-and-conditions"
                  className="inline-flex items-center gap-2 text-[0.78rem] text-white/40 transition-colors duration-300 hover:text-white/80"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Terms & Conditions
                </Link>
              </div>
            </aside>

            <div className="space-y-14">
              {POLICY_SECTIONS.map((section, index) => (
                <article
                  key={section.title}
                  id={`section-${index + 1}`}
                  className="scroll-mt-28"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-white/24 sm:text-[0.6rem]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-[clamp(1.4rem,3.5vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                      {section.title}
                    </h2>
                  </div>
                  <div className="mt-5 space-y-4 pl-[3.2rem] sm:pl-14">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-[0.9rem] leading-[1.8] tracking-[0] text-white/55 sm:text-[0.95rem]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
