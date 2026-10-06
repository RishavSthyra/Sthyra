export type PortfolioCategory = "renders" | "web" | "films" | "walkthrough" | "twins";

export type PortfolioProject = {
  id: number;
  category: PortfolioCategory;
  service: string;
  title: string;
  year: string;
  tone: string;
  assetPath?: string;
  imageAlt?: string;
  description?: string;
  externalUrl?: string;
  width?: number;
  height?: number;
};

const configuredAssetBaseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_ASSET_BASE_URL?.trim();

export const PORTFOLIO_ASSET_BASE_URL = (
  configuredAssetBaseUrl || "https://cdn.sthyra.com/portfolio"
).replace(/\/+$/, "");

export function getPortfolioAssetUrl(assetPath: string) {
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  return `${PORTFOLIO_ASSET_BASE_URL}/${assetPath.replace(/^\/+/, "")}`;
}

const ultraRealRenderAssets = [
  ["01_CarView.0000.avif", 3840, 2160],
  ["03_EntranceShots.-0001.avif", 3840, 2160],
  ["04_FootBAll.-0001.avif", 3840, 2160],
  ["05_baSKETabLL.-0001.avif", 3840, 2160],
  ["06_CricketzCloseup.-0001.avif", 3840, 2160],
  ["07_CricketCloseup2.-0001.avif", 3840, 2160],
  ["CineShot01.0261.avif", 3840, 2160],
  ["CineShot03.0000.avif", 3840, 2160],
  ["CineShot04.0299.avif", 3840, 2160],
  ["CineShot05.0000.avif", 3840, 2160],
  ["CineShot06.0000.avif", 3840, 2160],
  ["CineShot07.0299.avif", 3840, 2160],
  ["CineShot08.0000.avif", 3840, 2160],
  ["CineShot09.0024.avif", 3840, 2160],
  ["CineShot10.0000.avif", 3840, 2160],
  ["CineShot10.0300.avif", 3840, 2160],
  ["CineShot12.0000.avif", 3840, 2160],
  ["CineShot13.0000.avif", 3840, 2160],
  ["CineShot14.0000.avif", 3840, 2160],
  ["CineShot15.0007.avif", 3840, 2160],
  ["CineShot16.0000.avif", 3840, 2160],
  ["CineShot17.0000.avif", 3840, 2160],
  ["CineShot18.0000.avif", 3840, 2160],
  ["CineShot19.0299.avif", 3840, 2160],
  ["CineShot20.0000.avif", 3840, 2160],
  ["CineShot21.0299.avif", 3840, 2160],
  ["CineShot22.0000.avif", 3840, 2160],
  ["CineShot25.0299.avif", 3840, 2160],
  ["CineShot26.0000.avif", 3840, 2160],
  ["CineShot27.0419.avif", 3840, 2160],
  ["CineShot28.0299.avif", 3840, 2160],
  ["CineShot30.0000.avif", 3840, 2160],
  ["CineShot31.0000.avif", 3840, 2160],
  ["CineShot32.0000.avif", 3840, 2160],
  ["CineShot33.0179.avif", 3840, 2160],
  ["CineShot34.0000.avif", 3840, 2160],
  ["TESSTTSTS.0000.avif", 7680, 4320],
  ["TopRender.0000.avif", 7680, 4320],
  ["bros.0000.avif", 3840, 2160],
  ["bros1.0000.avif", 3840, 2160],
] as const;

const walkthroughProjects: PortfolioProject[] = [
  {
    id: 201,
    category: "walkthrough",
    service: "Virtual walkthrough",
    title: "Aadhya Serene",
    year: "2026",
    tone: "",
    assetPath: "walkthrough/walkthrough_aadhyaserene.png",
    imageAlt: "Aadhya Serene interactive residential walkthrough",
    description:
      "Explore Aadhya Serene’s architecture, landscaped approach, and key residential spaces through a guided experience before visiting in person.",
    externalUrl: "https://app.aadhyaserene.com/walkthrough",
    width: 3840,
    height: 1898,
  },
  {
    id: 202,
    category: "walkthrough",
    service: "Virtual walkthrough",
    title: "Tula Whisper of Trees",
    year: "2026",
    tone: "",
    assetPath: "walkthrough/walkthrough_tula.png",
    imageAlt: "Tula Whisper of Trees exterior panoramic walkthrough",
    description:
      "Navigate Tula Whisper of Trees through an exterior panoramic tour with clear directions and fast transitions between viewpoints.",
    externalUrl: "https://tula-peach.vercel.app/exterior-walkthrough",
    width: 3840,
    height: 1908,
  },
  {
    id: 203,
    category: "walkthrough",
    service: "Virtual walkthrough",
    title: "Trifecta Veranza",
    year: "2026",
    tone: "",
    assetPath: "walkthrough/walkthrough_trifecta.png",
    imageAlt: "Trifecta Veranza exterior panoramic walkthrough",
    description:
      "Explore Trifecta Veranza’s exterior through a panoramic walkthrough with directional navigation and quick transitions between key locations.",
    externalUrl: "https://trifecta-veranza.vercel.app/exterior-walkthrough",
    width: 3840,
    height: 1910,
  },
];

const interactiveWebProjects: PortfolioProject[] = [
  {
    id: 301,
    category: "web",
    service: "Interactive web app",
    title: "Aadhya Serene",
    year: "2026",
    tone: "",
    assetPath: "web-apps/Aadhya%20Serene%20Webapp.png",
    imageAlt: "Aadhya Serene interactive real estate web application",
    description:
      "A focused digital experience for a 1.5-acre residential community, bringing its architecture, amenities, and everyday character into view.",
  },
  {
    id: 302,
    category: "web",
    service: "Interactive web app",
    title: "Trifecta Veranza",
    year: "2026",
    tone: "",
    assetPath: "web-apps/Trifecta.png",
    imageAlt: "Trifecta Veranza interactive real estate web application",
    description:
      "An immersive presentation of a six-acre development with two landmark towers rising 36 floors above the surrounding landscape.",
  },
  {
    id: 303,
    category: "web",
    service: "Interactive web app",
    title: "Tula Whisper of Trees",
    year: "2026",
    tone: "",
    assetPath: "web-apps/Tula%20Web%20app.png",
    imageAlt: "Tula Whisper of Trees interactive real estate web application",
    description:
      "An immersive journey through a seven-acre community shaped by a rich variety of trees, landscapes, and living experiences.",
  },
];

const ultraRealRenderProjects: PortfolioProject[] = ultraRealRenderAssets.map(
  ([fileName, width, height], index) => ({
    id: 101 + index,
    category: "renders",
    service: "Ultra-real render",
    title: `Ultra-real render ${String(index + 1).padStart(2, "0")}`,
    year: "2026",
    tone: "from-[#262626] via-[#444] to-[#191919]",
    assetPath: `ultra-real-renders/${fileName}`,
    imageAlt: `Ultra-real architectural visualization ${index + 1}`,
    description:
      "Light, material, and atmosphere come together to make an unbuilt place feel convincingly real.",
    width,
    height,
  }),
);

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  ...ultraRealRenderProjects,
  ...walkthroughProjects,
  ...interactiveWebProjects,
];
