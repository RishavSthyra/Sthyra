import type { Metadata } from "next";
import HomeExperience from "@/components/HomeExperience";
import {
  HOME_SEO,
  getHomeServicesJsonLd,
  getLocalBusinessJsonLd,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
  getFAQJsonLd,
  jsonLdScript,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  keywords: HOME_SEO.keywords,
  alternates: {
    canonical: "/",
  },
};

const HOMEPAGE_FAQS = [
  {
    question: "What is architectural visualization and why does it matter for real estate?",
    answer: "Architectural visualization uses 3D rendering, cinematic films, and interactive experiences to show unbuilt properties. For real estate developers in Bangalore and India, it helps buyers understand projects before construction, accelerating sales and reducing buyer uncertainty.",
  },
  {
    question: "Where is Sthyra located?",
    answer: "Sthyra is based in Bangalore, India, serving real estate developers, architects, and property brands across India, the US, UAE, and UK.",
  },
  {
    question: "What services does Sthyra offer?",
    answer: "Sthyra offers cinematic real estate films, ultra-real 3D renders, interactive property websites, digital twins, AR experiences, and VR walkthroughs for real estate projects.",
  },
  {
    question: "How long does it take to create architectural visualization content?",
    answer: "Project timelines vary based on complexity. Typical real estate renders take 2-4 weeks, while cinematic films and digital twins may take 4-8 weeks. Contact us with your timeline requirements.",
  },
  {
    question: "Can Sthyra work with international real estate developers?",
    answer: "Yes. While based in Bangalore, Sthyra works with real estate developers, architects, and property brands across India, the United States, United Arab Emirates, and United Kingdom.",
  },
];

export default function Home() {
  const structuredData: Array<{ "@context": string; "@type": string; [key: string]: unknown }> = [
    getOrganizationJsonLd(),
    getLocalBusinessJsonLd(),
    getWebsiteJsonLd(),
    getHomeServicesJsonLd(),
    getFAQJsonLd(HOMEPAGE_FAQS),
  ];

  return (
    <>
      {structuredData.map((jsonLd, index) => (
        <script
          key={`${jsonLd["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
      ))}
      <HomeExperience />
    </>
  );
}
