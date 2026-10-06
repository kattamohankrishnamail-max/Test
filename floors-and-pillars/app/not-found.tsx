import ButtonLink from "@/components/ui/ButtonLink";
import PageHead from "@/components/ui/PageHead";

export const metadata = { title: "Page not found · Floors & Pillars" };

export default function NotFound() {
  return (
    <PageHead
      label="Sheet not found"
      title="We couldn't find that page."
      lede="The link may be out of date. The homes, guides and journal are a click away, or you can tell us what you're looking for."
      aside={
        <div className="flex flex-wrap gap-3 md:justify-end">
          <ButtonLink href="/brief">Share your brief</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Return home
          </ButtonLink>
        </div>
      }
    />
  );
}
