import { z } from "zod";

/**
 * Site-wide settings. Everything a non-developer may need to change lives here or in /content.
 * Values wrapped in [[PLACEHOLDER: …]] must be replaced before launch (`npm run content:check`).
 */
const SiteConfigSchema = z.object({
  name: z.string(),
  proposition: z.string(),
  description: z.string(),
  url: z.string().url(),
  contact: z.object({
    phone: z.string(),
    whatsapp: z.string(),
    email: z.string(),
    address: z.string(),
    hours: z.string(),
  }),
  reraAgentNumber: z.string(),
  feeDisclosure: z.string(),
  feeModelDetail: z.string(),
  /** Only when true may the word "independent" appear anywhere on the site. */
  isIndependentFeeModel: z.boolean(),
  responseTime: z.string(),
  social: z.array(z.object({ label: z.string(), href: z.string() })),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

export const site: SiteConfig = SiteConfigSchema.parse({
  name: "Floors & Pillars",
  proposition: "Residential advisory for exceptional homes in Bengaluru.",
  description:
    "Floors & Pillars helps you find, evaluate and buy exceptional apartments and villas in Bengaluru. We don't show you everything. We show you what's worth considering.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contact: {
    phone: "[[PLACEHOLDER: phone number]]",
    whatsapp: "[[PLACEHOLDER: WhatsApp number]]",
    email: "[[PLACEHOLDER: email address]]",
    address: "[[PLACEHOLDER: office address]]",
    hours: "[[PLACEHOLDER: office hours]]",
  },
  reraAgentNumber: "[[PLACEHOLDER: K-RERA agent registration no.]]",
  feeDisclosure: "[[PLACEHOLDER: one-line fee disclosure, e.g. how Floors & Pillars is paid]]",
  feeModelDetail: "[[PLACEHOLDER: fee model disclosure — to be confirmed]]",
  isIndependentFeeModel: false,
  responseTime: "[[PLACEHOLDER: response time, e.g. 48 hours]]",
  social: [],
});

export const isPlaceholder = (v: string | undefined | null) => !v || v.includes("[[PLACEHOLDER");
