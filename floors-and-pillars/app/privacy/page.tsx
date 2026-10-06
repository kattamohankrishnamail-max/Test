import LegalPage from "@/components/layout/LegalPage";
import { privacy } from "@/content/pages/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: privacy.title, description: "How Floors & Pillars handles your personal data.", path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage {...privacy} />;
}
