import { notFound } from "next/navigation";
import DeskApp from "@/components/desk/DeskApp";
import { Container } from "@/components/ui/Section";
import { deskEnabled, deskNeedsPasscode } from "@/lib/desk/auth";
import { getMarkets } from "@/lib/content/load";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata({ title: "Advisor desk", description: "Internal.", path: "/desk", noindex: true });

export default function DeskPage() {
  if (!deskEnabled()) notFound();
  return (
    <Container className="py-12 sm:py-16">
      <p className="eyebrow">Internal · Advisor desk</p>
      <h1 className="display-lg mt-4">Brief to shortlist</h1>
      <p className="lede mt-4">
        Upload the property database, open a brief, and get a ranked first cut with the reasons for each home. The shortlist is a starting point for
        your judgement, not a replacement for it.
      </p>
      <div className="mt-12">
        <DeskApp needsPasscode={deskNeedsPasscode()} markets={getMarkets()} />
      </div>
    </Container>
  );
}
