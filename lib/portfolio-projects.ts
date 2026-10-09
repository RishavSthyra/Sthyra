import { getPortfolioAssetUrl } from "@/lib/portfolio";

export type PortfolioStory = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  location: string;
  year: string;
  acreage: string;
  statement: string;
  overview: string;
  heroImage: string;
  webAppImage: string;
  webAppUrl: string;
  webAppCopy: string;
  walkthroughImage: string;
  walkthroughUrl: string;
  walkthroughCopy: string;
  cinematicImage: string;
  cinematicCopy: string;
  renders: string[];
  facts: Array<{ label: string; value: string }>;
};

const render = (fileName: string) =>
  getPortfolioAssetUrl(`ultra-real-renders/${fileName}`);

const walkthrough = (fileName: string) =>
  getPortfolioAssetUrl(`walkthrough/${fileName}`);

const webApp = (fileName: string) =>
  getPortfolioAssetUrl(`web-apps/${fileName}`);

export const PORTFOLIO_STORIES: PortfolioStory[] = [
  {
    slug: "trifecta-veranza",
    name: "Trifecta Veranza",
    shortName: "Veranza",
    eyebrow: "Residential development",
    location: "Bengaluru, India",
    year: "2026",
    acreage: "6 acres",
    statement: "Two towers. Thirty-six floors. One connected spatial story.",
    overview:
      "Trifecta Veranza is a six-acre residential development shaped around two 36-floor towers. Sthyra translated its scale into a coherent launch system—architectural imagery, an interactive web platform, panoramic navigation, and cinematic visual direction working as one experience.",
    heroImage: walkthrough("walkthrough_trifecta.png"),
    webAppImage: webApp("Trifecta.png"),
    webAppUrl: "https://trifecta-veranza.vercel.app/",
    webAppCopy:
      "A guided project platform that makes a large vertical community clear, navigable, and compelling before a physical visit.",
    walkthroughImage: walkthrough("walkthrough_trifecta.png"),
    walkthroughUrl:
      "https://trifecta-veranza.vercel.app/exterior-walkthrough",
    walkthroughCopy:
      "A panoramic exterior journey connects arrival, landscape, amenities, and the movement between key locations across the development.",
    cinematicImage: "/Cinematic_Image_1.avif",
    cinematicCopy:
      "Measured camera language, material detail, and changing light turn the development into a launch narrative rather than a sequence of views.",
    renders: [
      render("03_EntranceShots.-0001.avif"),
      render("04_FootBAll.-0001.avif"),
      render("05_baSKETabLL.-0001.avif"),
      render("06_CricketzCloseup.-0001.avif"),
      render("07_CricketCloseup2.-0001.avif"),
      render("CineShot12.0000.avif"),
    ],
    facts: [
      { label: "Scale", value: "6 acres" },
      { label: "Architecture", value: "2 towers" },
      { label: "Height", value: "36 floors" },
      { label: "Scope", value: "Full digital launch" },
    ],
  },
  {
    slug: "tula-whisper-of-trees",
    name: "Tula Whisper of Trees",
    shortName: "Tula",
    eyebrow: "Nature-led community",
    location: "Bengaluru, India",
    year: "2026",
    acreage: "7 acres",
    statement: "A seven-acre community told through landscape, movement, and quiet detail.",
    overview:
      "Tula Whisper of Trees is a seven-acre residential community defined by its landscape and rich variety of trees. The project experience was built to let that character lead—from the first frame to the interactive site and panoramic walkthrough.",
    heroImage: walkthrough("walkthrough_tula.png"),
    webAppImage: webApp("Tula%20Web%20app.png"),
    webAppUrl: "https://tula-peach.vercel.app/",
    webAppCopy:
      "An editorial web experience where landscape, architecture, amenities, and the project story unfold with calm, deliberate pacing.",
    walkthroughImage: walkthrough("walkthrough_tula.png"),
    walkthroughUrl: "https://tula-peach.vercel.app/exterior-walkthrough",
    walkthroughCopy:
      "The exterior walkthrough lets buyers move through a tree-rich environment and understand the relationship between homes and landscape.",
    cinematicImage: "/Cinematic_Image_2.avif",
    cinematicCopy:
      "The cinematic direction keeps nature in the foreground, using atmosphere and restrained movement to make the place feel lived in.",
    renders: [
      render("CineShot06.0000.avif"),
      render("CineShot07.0299.avif"),
      render("CineShot08.0000.avif"),
      render("CineShot09.0024.avif"),
      render("CineShot10.0000.avif"),
      render("CineShot10.0300.avif"),
    ],
    facts: [
      { label: "Scale", value: "7 acres" },
      { label: "Landscape", value: "Tree-led planning" },
      { label: "Experience", value: "Web + panorama" },
      { label: "Direction", value: "Nature first" },
    ],
  },
  {
    slug: "aadhya-serene",
    name: "Aadhya Serene",
    shortName: "Aadhya",
    eyebrow: "Residential community",
    location: "Bengaluru, India",
    year: "2026",
    acreage: "1.5 acres",
    statement: "A compact community made legible through one precise digital experience.",
    overview:
      "Aadhya Serene is a focused 1.5-acre residential development. Its digital system brings architecture, approach, amenities, and key spaces into a single clear journey—giving buyers a stronger understanding of the project before arriving on site.",
    heroImage: walkthrough("walkthrough_aadhyaserene.png"),
    webAppImage: webApp("Aadhya%20Serene%20Webapp.png"),
    webAppUrl: "https://app.aadhyaserene.com/",
    webAppCopy:
      "A concise sales platform that combines project information, architectural storytelling, and direct access to the immersive walkthrough.",
    walkthroughImage: walkthrough("walkthrough_aadhyaserene.png"),
    walkthroughUrl: "https://app.aadhyaserene.com/walkthrough",
    walkthroughCopy:
      "A guided digital visit through the project approach, architecture, landscape, and residential spaces before the physical site visit.",
    cinematicImage: "/Cinematic_image_3.avif",
    cinematicCopy:
      "Cinematic compositions give the compact development a distinct identity while keeping the architecture and everyday experience believable.",
    renders: [
      render("01_CarView.0000.avif"),
      render("CineShot01.0261.avif"),
      render("CineShot03.0000.avif"),
      render("CineShot04.0299.avif"),
      render("CineShot05.0000.avif"),
      render("CineShot13.0000.avif"),
    ],
    facts: [
      { label: "Scale", value: "1.5 acres" },
      { label: "Type", value: "Residential" },
      { label: "Experience", value: "Guided digital visit" },
      { label: "Scope", value: "Integrated launch" },
    ],
  },
];

export function getPortfolioStory(slug: string) {
  return PORTFOLIO_STORIES.find((project) => project.slug === slug);
}

export function getNextPortfolioStory(slug: string) {
  const index = PORTFOLIO_STORIES.findIndex((project) => project.slug === slug);
  if (index < 0) return PORTFOLIO_STORIES[0];
  return PORTFOLIO_STORIES[(index + 1) % PORTFOLIO_STORIES.length];
}
