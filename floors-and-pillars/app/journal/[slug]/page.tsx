import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { journalPage as copy } from "@/content/pages/other";
import { getAdvisor, getArticle, getArticles, getGuides, getHomes, readingMinutes } from "@/lib/content/load";
import { Mdx } from "@/lib/content/mdx";
import { JsonLd, articleJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug);
  return a ? pageMetadata({ title: a.meta.title, description: a.meta.dek, path: `/journal/${a.meta.slug}`, type: "article" }) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();
  const a = article.meta;
  const author = await getAdvisor(a.author);
  const [homes, guides] = await Promise.all([getHomes(), getGuides()]);
  const related = [
    ...homes.filter((h) => a.related.homes.includes(h.meta.slug)).map((h) => ({ href: `/homes/${h.meta.slug}`, label: h.meta.name, kind: "Home" })),
    ...guides.filter((g) => a.related.guides.includes(g.meta.slug)).map((g) => ({ href: `/bengaluru/${g.meta.slug}`, label: g.meta.name, kind: "Guide" })),
  ];
  const date = new Date(`${a.date}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <article>
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-[68ch]">
          <p className="eyebrow">
            <Link href="/journal" className="hover:text-ink">
              Journal
            </Link>
          </p>
          <h1 className="display-xl mt-5">{a.title}</h1>
          <p className="lede mt-6">{a.dek}</p>
          <p className="mt-8 border-t border-line pt-4 text-[0.92rem] text-stone">
            {author && (
              <>
                {copy.by} <span className="text-ink">{author.name}</span> ·{" "}
              </>
            )}
            <time dateTime={a.date}>{date}</time> · {copy.minRead(readingMinutes(article.body))}
          </p>
          <div className="mt-12 text-[1.1rem] leading-[1.8]">
            <Mdx source={article.body} />
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related" className="mt-20 border-t border-line pt-8">
              <h2 id="related" className="eyebrow">
                {copy.related}
              </h2>
              <ul className="mt-4">
                {related.map((r) => (
                  <li key={r.href} className="border-b border-line">
                    <Link href={r.href} className="flex min-h-14 items-center justify-between gap-4 py-3 hover:text-verdigris">
                      <span className="font-serif text-[1.35rem]">{r.label}</span>
                      <span className="text-[0.8rem] uppercase tracking-[0.14em] text-stone">{r.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-16 font-serif text-[1.6rem] leading-snug">
            {copy.softCta}{" "}
            <Link href="/brief" className="link">
              {copy.softCtaLink}
            </Link>
          </p>
        </div>
      </Container>
      <JsonLd data={articleJsonLd({ title: a.title, dek: a.dek, date: a.date, author: author?.name ?? "", path: `/journal/${a.slug}` })} />
    </article>
  );
}
