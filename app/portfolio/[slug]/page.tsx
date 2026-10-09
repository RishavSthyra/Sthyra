import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectStoryExperience from "@/components/portfolio/ProjectStoryExperience";
import {
  PORTFOLIO_STORIES,
  getNextPortfolioStory,
  getPortfolioStory,
} from "@/lib/portfolio-projects";
import { absoluteUrl } from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PORTFOLIO_STORIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioStory(slug);

  if (!project) return {};

  return {
    title: `${project.name} | Sthyra Portfolio`,
    description: project.overview,
    alternates: { canonical: absoluteUrl(`/portfolio/${project.slug}`) },
    openGraph: {
      title: `${project.name} | Sthyra Portfolio`,
      description: project.overview,
      url: absoluteUrl(`/portfolio/${project.slug}`),
      images: [{ url: project.heroImage }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getPortfolioStory(slug);

  if (!project) notFound();

  return (
    <ProjectStoryExperience
      project={project}
      nextProject={getNextPortfolioStory(project.slug)}
    />
  );
}
