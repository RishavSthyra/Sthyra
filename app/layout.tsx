import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import { HOME_SEO, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: HOME_SEO.title,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_SEO.description,
  keywords: HOME_SEO.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Architectural visualization",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [
      {
        url: absoluteUrl("/images_last_frame.jpg"),
        width: 1200,
        height: 630,
        alt: "Sthyra architectural visualization and real estate digital twin studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: [absoluteUrl("/images_last_frame.jpg")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18170775934"
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18170775934');
        `}
      </Script>
      <body className="min-h-full overflow-x-hidden bg-black font-sans text-white">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
