
import type { Metadata } from "next";
import GLBScene from "@/components/CreatingGlb";

export const metadata: Metadata = {
  title: "3D Logo Experiment",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <GLBScene />;
}
