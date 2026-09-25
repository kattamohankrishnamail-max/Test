import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";
import { LIFESTYLE_CHOICES } from "./config.ts";
import { canonicalPlace } from "./locations.ts";
import type { Lifestyle, Requirements } from "./types.ts";

/**
 * Optional AI requirement extraction. Used only to read the client's free text into
 * structured fields; matching always runs on the Excel data. If no API key is set,
 * or the call fails, the rule-based extractor's result is used unchanged.
 */

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5";

export const llmEnabled = () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

const LIFESTYLE_VALUES = LIFESTYLE_CHOICES.map((l) => l.value) as [Lifestyle, ...Lifestyle[]];

const BriefSchema = z.object({
  property_type: z.enum(["apartment", "villa", "either"]),
  bedrooms: z.array(z.number()).describe("Requested bedroom counts, e.g. [4] for '4 BHK', [4,5] for '4 or 5 BHK'"),
  bedrooms_at_least: z.boolean().describe("True when the client says '5 BHK+' or 'at least 4 bedrooms'"),
  penthouse: z.boolean(),
  budget_min_crore: z.number().nullable(),
  budget_max_crore: z.number().nullable().describe("'around ₹5 crore' → 5; 'under 8 Cr' → 8"),
  locations: z.array(z.string()).describe("Bengaluru neighbourhoods or zones, e.g. 'Whitefield', 'East Bengaluru', 'ORR'"),
  min_area_sqft: z.number().nullable(),
  possession: z.enum(["ready", "12m", "1-2y", "2y+", "flexible"]).nullable(),
  lifestyle: z.array(z.enum(LIFESTYLE_VALUES)),
  preferences: z.array(z.string()).describe("Short phrases for other stated preferences, e.g. 'family', 'quiet'"),
});

const SYSTEM = `You read a luxury home buyer's brief for Bengaluru and extract what they asked for.
Only record what the client actually said or clearly implied. Leave a field null or empty rather than guessing.
Budgets are in ₹ crore (1 crore = 100 lakh). A single figure like "around ₹5 crore" is a budget ceiling.
Lifestyle values: ${LIFESTYLE_CHOICES.map((l) => `${l.value} (${l.label})`).join(", ")}.
"Spacious"/"large" → large-homes; "quiet"/"peaceful" → privacy; "near the airport" → airport.
Possession: ready = ready to move; 12m = within a year; 1-2y; 2y+ = happy to wait; flexible.`;

let client: Anthropic | null = null;

export async function extractWithClaude(text: string, rules: Requirements): Promise<Requirements | null> {
  client ??= new Anthropic({ timeout: 20_000, maxRetries: 1 });
  try {
    const res = await client.messages.parse({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM,
      output_config: { effort: "low", format: zodOutputFormat(BriefSchema) },
      messages: [{ role: "user", content: text }],
    });
    if (res.stop_reason === "refusal" || !res.parsed_output) return null;
    const b = res.parsed_output;
    return {
      propertyType: b.property_type,
      locations: [...new Set(b.locations.map(canonicalPlace))],
      budgetMinCr: b.budget_min_crore,
      budgetMaxCr: b.budget_max_crore,
      bedrooms: b.bedrooms.filter((n) => n >= 1 && n <= 10),
      bedroomsAtLeast: b.bedrooms_at_least,
      penthouse: b.penthouse,
      minAreaSqft: b.min_area_sqft,
      possession: b.possession,
      lifestyle: b.lifestyle,
      notes: b.preferences.length ? b.preferences : rules.notes,
    };
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      console.warn(`AI extraction unavailable (${e.status ?? "network"}); using rule-based extraction.`);
    } else {
      console.warn("AI extraction failed; using rule-based extraction.", e);
    }
    return null;
  }
}
