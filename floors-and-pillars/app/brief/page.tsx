import BriefForm from "@/components/brief/BriefForm";
import { Container } from "@/components/ui/Section";
import { briefPage } from "@/content/pages/brief";
import { draftFromParams } from "@/lib/brief/prefill";
import { getHome, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...briefPage.meta, path: "/brief" });

export default async function BriefPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const markets = getMarkets();
  const draft = draftFromParams(params, markets.map((m) => m.slug));
  const home = draft.home ? await getHome(draft.home) : null;
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="eyebrow">Share your brief</p>
        <h1 className="display-xl mt-5">{briefPage.title}</h1>
        <p className="lede mt-6">{briefPage.intro}</p>
      </div>
      <div>
        <BriefForm
          initial={{ ...draft, home: home ? draft.home : undefined }}
          markets={markets.map(({ slug, name, zone }) => ({ slug, name, zone }))}
          homeName={home?.meta.name}
          errorCode={error}
        />
      </div>
    </Container>
  );
}
