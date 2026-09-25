import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { journalPage as copy } from "@/content/pages/other";
import { getArticles, readingMinutes } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/journal" });

const date = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function JournalPage() {
  const articles = await getArticles();
  return (
    <Container className="py-16 sm:py-24">
      <p className="eyebrow">Journal</p>
      <h1 className="display-xl mt-5">{copy.title}</h1>
      <p className="lede mt-6">{copy.intro}</p>
      {articles.length ? (
        <ul className="mt-16 border-t border-line">
          {articles.map((a) => (
            <li key={a.meta.slug} className="border-b border-line">
              <Link href={`/journal/${a.meta.slug}`} className="group grid gap-3 py-10 md:grid-cols-[1fr_2fr] md:gap-12">
                <p className="text-[0.9rem] text-stone">
                  <time dateTime={a.meta.date}>{date(a.meta.date)}</time> · {copy.minRead(readingMinutes(a.body))}
                </p>
                <div>
                  <h2 className="display-md transition-colors group-hover:text-verdigris">{a.meta.title}</h2>
                  <p className="mt-3 text-ink-soft">{a.meta.dek}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-ink-soft">{copy.empty}</p>
      )}
    </Container>
  );
}
