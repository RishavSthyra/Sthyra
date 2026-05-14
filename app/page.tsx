import type { Metadata } from "next";
import HomeExperience from "@/components/HomeExperience";
import {
  HOME_SEO,
  getHomeServicesJsonLd,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
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

export default function Home() {
  const structuredData = [
    getOrganizationJsonLd(),
    getWebsiteJsonLd(),
    getHomeServicesJsonLd(),
  ];

  return (
    <>
      {structuredData.map((jsonLd) => (
        <script
          key={jsonLd["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
        />
      ))}
      <HomeExperience />
    </>
  );
}
