import { DM_Sans } from "next/font/google";
import PortfolioNavigation from "@/components/portfolio/PortfolioNavigation";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
});

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${dmSans.className} bg-[#f3f1eb] text-[#11110f]`}>
      <PortfolioNavigation />
      {children}
    </div>
  );
}
