import type { MetadataRoute } from "next";
import { SERVICE_PAGES } from "@/lib/services";
import { SITE_URL, absoluteUrl, getServiceUrl } from "@/lib/seo";

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceUrls = SERVICE_PAGES.map((service) => ({
    url: getServiceUrl(service.slug),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    images: [
      absoluteUrl(`${service.hero.tileBasePath}/${service.hero.tilePrefix}_0_0.jpg`),
      absoluteUrl(service.imagePlaceholders[0]?.imageSrc ?? "/images_last_frame.jpg"),
    ],
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        absoluteUrl("/images_last_frame.jpg"),
        absoluteUrl("/ultrarender1.avif"),
        absoluteUrl("/Cinematic_Image_1.avif"),
      ],
    },
    ...serviceUrls,
  ];
}
