import ButtonLink from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Section";

export const metadata = { title: "Page not found · Floors & Pillars" };

export default function NotFound() {
  return (
    <Container className="py-32 sm:py-44">
      <p className="eyebrow">Not found</p>
      <h1 className="display-lg mt-5 max-w-2xl">We couldn&apos;t find that page.</h1>
      <p className="lede mt-6">The link may be out of date. The homes, guides and journal are a click away, or you can tell us what you&apos;re looking for.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/brief">Share your brief</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Return home
        </ButtonLink>
      </div>
    </Container>
  );
}
