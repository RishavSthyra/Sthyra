import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Sthyra privacy policy covering website inquiries, contact forms, chatbot messages, analytics, cookies, and client communication.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Sthyra",
    description:
      "How Sthyra handles website, contact form, chatbot, analytics, and project inquiry data.",
    url: "/privacy-policy",
    images: [
      {
        url: absoluteUrl("/images_last_frame.jpg"),
        width: 1200,
        height: 630,
        alt: "Sthyra privacy policy",
      },
    ],
  },
};

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}