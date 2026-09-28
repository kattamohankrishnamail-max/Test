import Link from "next/link";
import PageHead from "@/components/ui/PageHead";
import { Container } from "@/components/ui/Section";
import { journalPage as copy } from "@/content/pages/other";
import { getArticles, readingMinutes } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ ...copy.meta, path: "/journal" });

const date = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function JournalPage() {
  const articles = await getArticles();
  return (
    <>
      <PageHead label="Journal" title={copy.title} lede={copy.intro} />
      <Container className="pb-20">
      {articles.length ? (
        <ol className="border-t border-ink">
          {articles.map((a) => (
            <li key={a.meta.slug} className="border-b border-line">
              <Link href={`/journal/${a.meta.slug}`} className="group grid gap-3 py-8 md:grid-cols-[1fr_2fr] md:gap-12">
                <p className="text-[0.9rem] text-stone">
                  <time dateTime={a.meta.date}>{date(a.meta.date)}</time> · {copy.minRead(readingMinutes(a.body))}
                </p>
                <div>
                  <h2 className="display-md group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{a.meta.title}</h2>
                  <p className="mt-3 text-ink-soft">{a.meta.dek}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="border-t border-ink pt-6 text-ink-soft">{copy.empty}</p>
      )}
      </Container>
    </>
  );
}
