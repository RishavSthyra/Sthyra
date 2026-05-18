import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Sthyra terms and conditions governing the use of our website, architectural visualization services, project engagements, and client agreements.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Sthyra",
    description:
      "Rules, rights, and responsibilities governing your use of Sthyra website and services.",
    url: "/terms-and-conditions",
    images: [
      {
        url: absoluteUrl("/images_last_frame.jpg"),
        width: 1200,
        height: 630,
        alt: "Sthyra terms and conditions",
      },
    ],
  },
};

export default function TermsAndConditionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}