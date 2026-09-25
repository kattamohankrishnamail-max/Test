import "server-only";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";

/** Pull quote usable in MDX as <PullQuote>…</PullQuote>. */
function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure className="my-12 border-y border-bronze/50 py-8">
      <blockquote className="font-serif text-[1.9rem] leading-snug text-ink">{children}</blockquote>
    </figure>
  );
}

const components: MDXComponents = { PullQuote };

/** Compiles trusted, repository-owned MDX at build time. Never pass user input here. */
export async function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  const { default: Content } = await evaluate(source, { ...runtime });
  return (
    <div className="prose-fp">
      <Content components={components} />
    </div>
  );
}
