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
    <Container className="grid grid-cols-12 gap-x-6 gap-y-10 pb-20 pt-10 sm:pt-14">
      <div className="col-span-12 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
        <p className="label">Share your brief</p>
        <h1 className="display-lg mt-6">{briefPage.title}</h1>
        <p className="lede mt-6 border-t border-ink pt-5">{briefPage.intro}</p>
      </div>
      <div className="col-span-12 lg:col-span-7 lg:col-start-6">
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
