import Link from "next/link";
import CollectionMatches from "@/components/brief/CollectionMatches";
import PageHead from "@/components/ui/PageHead";
import { Container } from "@/components/ui/Section";
import { thankYouPage as copy } from "@/content/pages/brief";
import { getArticles, getHomes, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({ ...copy.meta, path: "/brief/thank-you", noindex: true });

export default async function ThankYouPage() {
  const [homes, articles] = await Promise.all([getHomes(), getArticles()]);
  return (
    <>
      <PageHead label="Brief received" title={copy.title} lede={copy.body(site.responseTime)} />
      <Container className="pb-20">
        <section aria-labelledby="next-title" className="border-t border-ink pt-6">
          <h2 id="next-title" className="display-md">
            {copy.nextTitle}
          </h2>
          <ol className="mt-8 border-t border-ink">
            {copy.next.map((s, i) => (
              <li key={s.name} className="grid grid-cols-12 items-baseline gap-x-6 border-b border-line py-5">
                <span className="numeral col-span-2 text-[2rem] leading-none">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display-sm col-span-10 sm:col-span-4">{s.name}</h3>
                <p className="col-span-10 col-start-3 mt-1 text-ink-soft sm:col-span-6 sm:col-start-auto">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <CollectionMatches homes={homes.map((h) => h.meta)} markets={getMarkets()} title={copy.matchesTitle} intro={copy.matchesIntro} />

        {articles.length > 0 && (
          <section aria-labelledby="reading-title" className="mt-16 border-t border-ink pt-6">
            <h2 id="reading-title" className="display-md">
              {copy.journalTitle}
            </h2>
            <ul className="mt-6 border-t border-line">
              {articles.slice(0, 3).map((a) => (
                <li key={a.meta.slug} className="border-b border-line">
                  <Link href={`/journal/${a.meta.slug}`} className="flex min-h-14 items-center py-3 font-serif text-[1.5rem] hover:underline hover:decoration-1 hover:underline-offset-4">
                    {a.meta.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
