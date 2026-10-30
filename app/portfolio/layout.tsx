import { Onest } from "next/font/google";
import PortfolioNavigation from "@/components/portfolio/PortfolioNavigation";

const onest = Onest({
  subsets: ["latin"],
  weight: "variable",
  display: "optional",
});

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${onest.className} bg-[#f3f1eb] text-[#11110f]`}>
      <PortfolioNavigation />
      {children}
    </div>
  );
}
