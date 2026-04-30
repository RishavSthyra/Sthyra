import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";

export const metadata: Metadata = {
  title: "STHYRA",
  description: "Premium particle typography hero built with Next.js, Three.js, and React Three Fiber.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full overflow-x-hidden bg-black font-sans text-white">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
