import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileBriefBar from "@/components/layout/MobileBriefBar";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/site.config";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s` },
  description: site.description,
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F3EEE4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-limestone focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBriefBar />
        <JsonLd data={organizationJsonLd()} />
      </body>
    </html>
  );
}
