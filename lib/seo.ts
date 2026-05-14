import { SERVICE_PAGES } from "@/lib/services";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sthyra.com"
).replace(/\/$/, "");

export const SITE_NAME = "Sthyra";

export const HOME_SEO = {
  title:
    "Architectural Visualization, 3D Rendering & Real Estate Digital Twins | Sthyra",
  description:
    "Sthyra creates cinematic real estate films, ultra-real 3D renders, interactive property websites, digital twins, and AR/VR walkthroughs for developers, architects, and luxury property brands.",
  keywords: [
    "architectural visualization studio",
    "3D rendering services",
    "real estate rendering",
    "real estate digital twins",
    "interactive real estate websites",
    "virtual property walkthroughs",
    "cinematic real estate films",
    "AR VR real estate experiences",
    "pre construction real estate marketing",
    "luxury property marketing visuals",
  ],
};

export const SEO_RESEARCH_NOTES = [
  "Primary commercial intent: architectural visualization, 3D rendering services, real estate rendering, photorealistic architectural rendering.",
  "Immersive experience intent: real estate digital twins, interactive 3D property models, virtual property walkthroughs, interactive real estate websites.",
  "Premium launch intent: cinematic real estate films, architectural walkthrough animation, property launch films, luxury real estate video marketing.",
  "Emerging spatial intent: AR real estate visualization, VR property tours, immersive real estate marketing, pre-construction VR walkthroughs.",
];

export const SERVICE_SEO_KEYWORDS: Record<string, string[]> = {
  "cinematic-real-estate-films": [
    "cinematic real estate films",
    "real estate video marketing",
    "architectural walkthrough animation",
    "property launch films",
    "pre construction real estate video",
    "luxury property video",
  ],
  "interactive-real-estate-web-experiences": [
    "interactive real estate websites",
    "3D property websites",
    "real estate web experiences",
    "virtual walkthrough website",
    "interactive property marketing",
    "real estate microsite design",
  ],
  "real-estate-digital-twins": [
    "real estate digital twins",
    "digital twins for real estate",
    "interactive 3D property models",
    "interactive masterplan",
    "3D real estate visualization platform",
    "sales gallery digital twin",
  ],
  "ultra-real-real-estate-renders": [
    "real estate renders",
    "architectural visualization",
    "photorealistic architectural rendering",
    "interior rendering",
    "exterior rendering",
    "property marketing visuals",
  ],
  "ar-vr-real-estate-experiences": [
    "VR real estate tours",
    "AR real estate visualization",
    "virtual property walkthroughs",
    "immersive real estate marketing",
    "360 real estate tours",
    "pre construction VR tour",
  ],
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getServiceUrl(slug: string) {
  return absoluteUrl(`/services/${slug}`);
}

export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "STHYRA",
    url: SITE_URL,
    logo: absoluteUrl("/sthyra_logo_new.png"),
    image: absoluteUrl("/images_last_frame.jpg"),
    slogan: "Redefining Reality",
    foundingDate: "2024",
    description: HOME_SEO.description,
    areaServed: ["India", "United States", "United Arab Emirates", "United Kingdom"],
    serviceType: [
      "Architectural visualization",
      "3D rendering",
      "Real estate digital twins",
      "Interactive real estate websites",
      "Cinematic real estate films",
      "AR and VR real estate experiences",
    ],
    sameAs: ["https://in.linkedin.com/company/sthyra"],
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: HOME_SEO.description,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en",
  };
}

export function getHomeServicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#services`,
    name: "Sthyra real estate visualization services",
    itemListElement: SERVICE_PAGES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getServiceUrl(service.slug),
      name: service.hero.eyebrow,
      description: service.metaDescription,
    })),
  };
}

export function getServiceJsonLd(slug: string) {
  const service = SERVICE_PAGES.find((page) => page.slug === slug);

  if (!service) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${getServiceUrl(service.slug)}#service`,
    name: service.hero.eyebrow,
    serviceType: service.hero.eyebrow,
    description: service.metaDescription,
    url: getServiceUrl(service.slug),
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: ["India", "United States", "United Arab Emirates", "United Kingdom"],
    audience: {
      "@type": "Audience",
      audienceType:
        "Real estate developers, architects, sales teams, investors, and luxury property brands",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.hero.eyebrow} deliverables`,
      itemListElement: service.whatWeCreate.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.title,
          description: item.body,
        },
      })),
    },
  };
}

export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
