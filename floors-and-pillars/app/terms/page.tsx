import LegalPage from "@/components/layout/LegalPage";
import { terms } from "@/content/pages/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: terms.title, description: "Terms of use for the Floors & Pillars website.", path: "/terms" });

export default function TermsPage() {
  return <LegalPage {...terms} />;
}
