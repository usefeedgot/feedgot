import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/global/container";
import { AlternativeHero } from "@/components/alternatives/hero";
import { FeatureComparisonTable } from "@/components/alternatives/FeatureComparisonTable";
import { ProsCons } from "@/components/alternatives/ProsCons";
import FAQs from "@/components/home/faq";
import BentoFeature from "@/components/home/bento-feature";
import Feature from "@/components/home/feature";
import StatsSection from "@/components/home/cta";
import {
  getAlternativeBySlug,
  getAlternativeSlugs,
} from "@/config/alternatives";

export async function generateStaticParams() {
  return getAlternativeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternativeBySlug(slug);
  if (!alt) return {};
  const title = `${alt.name} vs Feedgot`;
  const description =
    alt.summary ??
    `Compare ${alt.name} to Feedgot across features, privacy, and hosting.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alt = getAlternativeBySlug(slug);
  if (!alt) return notFound();

  return (
    <main className="min-h-screen pt-16">
      <AlternativeHero alt={alt} />
      <BentoFeature />
      <Feature />
      <FAQs />
      <StatsSection />

      {/* Comparison block below main sections */}
      <Container maxWidth="6xl" className="px-4 sm:px-16 lg:px-20 xl:px-24">
        {/* Comparison table */}
        <FeatureComparisonTable
          competitorName={alt.name}
          features={alt.features}
        />

        {/* Pros & Cons */}
        <ProsCons pros={alt.pros} cons={alt.cons} />

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/signup"
            className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Start with Feedgot — it’s free
          </a>
        </div>
      </Container>
    </main>
  );
}
