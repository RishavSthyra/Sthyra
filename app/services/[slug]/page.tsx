import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";
import ServiceScrollReset from "@/components/services/ServiceScrollReset";
import { getServicePage, SERVICE_PAGES } from "@/lib/services";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import {
  SERVICE_SEO_KEYWORDS,
  absoluteUrl,
  getBreadcrumbJsonLd,
  getOrganizationJsonLd,
  getServiceJsonLd,
  getServiceUrl,
  jsonLdScript,
} from "@/lib/seo";

type JsonLdObject = Record<string, unknown>;

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  // { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Services", ariaLabel: "View our services", link: "/services" },
  // { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];


const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "X", link: "https://twitter.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

export function generateStaticParams() {
  return SERVICE_PAGES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    return {};
  }

  return {
    title: service.seoTitle,
    description: service.metaDescription,
    keywords: SERVICE_SEO_KEYWORDS[service.slug],
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.seoTitle,
      description: service.metaDescription,
      type: "website",
      url: `/services/${service.slug}`,
      siteName: "Sthyra",
      images: [
        {
          url: absoluteUrl(`${service.hero.tileBasePath}/${service.hero.tilePrefix}_0_0.jpg`),
          width: 1200,
          height: 630,
          alt: service.hero.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: service.metaDescription,
      images: [absoluteUrl(`${service.hero.tileBasePath}/${service.hero.tilePrefix}_0_0.jpg`)],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    notFound();
  }

  const serviceJsonLd = getServiceJsonLd(service.slug);
  const structuredData: JsonLdObject[] = [
    getOrganizationJsonLd(),
    ...(serviceJsonLd ? [serviceJsonLd] : []),
    getBreadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: service.hero.eyebrow, url: getServiceUrl(service.slug) },
    ]),
  ];

  return (
    <>
      {structuredData.map((jsonLd) => (
        <script
          key={
            "@id" in jsonLd
              ? String(jsonLd["@id"])
              : jsonLd["@type"] === "BreadcrumbList"
                ? `${getServiceUrl(service.slug)}#breadcrumb`
                : service.slug
          }
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
      ))}
      <ServiceScrollReset />
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
      <ServicePageTemplate service={service} />
    </>
  );
}
