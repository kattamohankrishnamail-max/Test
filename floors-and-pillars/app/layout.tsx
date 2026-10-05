import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileBriefBar from "@/components/layout/MobileBriefBar";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/site.config";
import "./globals.css";

/* Brand Guidelines §04: Cormorant Garamond and Hanken Grotesk. Only the weights the site uses are loaded (Regular, Medium; Cormorant Italic for the tagline); the guideline asks to avoid Bold. */
const display = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const text = Hanken_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-text", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s` },
  description: site.description,
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#EDE6DA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${text.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only z-50 bg-oxblood px-5 text-limestone focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-12 focus:items-center"
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
