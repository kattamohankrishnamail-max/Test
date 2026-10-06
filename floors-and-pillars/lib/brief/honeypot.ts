/** Name of the hidden field bots tend to fill. Humans never see it. */
export const HONEYPOT_FIELD = "website";

export function isBot(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
