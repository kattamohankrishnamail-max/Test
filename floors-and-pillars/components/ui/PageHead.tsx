import type { ReactNode } from "react";
import { Container } from "./Section";

/** Opening of an inner page: sheet label, display title, then a heavy rule over the lede. */
export default function PageHead({ label, title, lede, aside }: { label: string; title: ReactNode; lede?: ReactNode; aside?: ReactNode }) {
  return (
    <Container className="pb-12 pt-10 sm:pt-14">
      <p className="label">{label}</p>
      <h1 className="display-xl mt-6 max-w-5xl">{title}</h1>
      {(lede || aside) && (
        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-6 border-t border-ink pt-6">
          {lede && <div className="lede col-span-12 md:col-span-8 lg:col-span-6">{lede}</div>}
          {aside && <div className="col-span-12 md:col-span-4 md:col-start-9 md:text-right">{aside}</div>}
        </div>
      )}
    </Container>
  );
}
