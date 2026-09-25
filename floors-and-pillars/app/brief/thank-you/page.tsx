import Link from "next/link";
import CollectionMatches from "@/components/brief/CollectionMatches";
import { Container, Rule } from "@/components/ui/Section";
import { thankYouPage as copy } from "@/content/pages/brief";
import { getArticles, getHomes, getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({ ...copy.meta, path: "/brief/thank-you", noindex: true });

export default async function ThankYouPage() {
  const [homes, articles] = await Promise.all([getHomes(), getArticles()]);
  return (
    <Container className="py-20 sm:py-28">
      <p className="eyebrow">Brief received</p>
      <h1 className="display-xl mt-5">{copy.title}</h1>
      <p className="lede mt-6">{copy.body(site.responseTime)}</p>

      <section aria-labelledby="next-title" className="mt-20">
        <h2 id="next-title" className="display-md">
          {copy.nextTitle}
        </h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3">
          {copy.next.map((s, i) => (
            <li key={s.name}>
              <Rule />
              <p className="mt-5 font-serif text-[2.2rem] leading-none text-bronze" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display-sm mt-3">{s.name}</h3>
              <p className="mt-2 text-ink-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <CollectionMatches homes={homes.map((h) => h.meta)} markets={getMarkets()} title={copy.matchesTitle} intro={copy.matchesIntro} />

      {articles.length > 0 && (
        <section aria-labelledby="reading-title" className="mt-24">
          <h2 id="reading-title" className="display-md">
            {copy.journalTitle}
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {articles.slice(0, 3).map((a) => (
              <li key={a.meta.slug}>
                <Link href={`/journal/${a.meta.slug}`} className="flex min-h-14 items-center py-3 font-serif text-[1.4rem] hover:text-verdigris">
                  {a.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
