import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * The advisor desk is internal. With DESK_PASSCODE set, requests need the matching
 * x-desk-passcode header. Without it, the desk is open in development and disabled
 * (404) in production.
 */
export const deskEnabled = () => !!process.env.DESK_PASSCODE || process.env.NODE_ENV !== "production";
export const deskNeedsPasscode = () => !!process.env.DESK_PASSCODE;

export function deskAuthorised(req: Request): boolean {
  if (!deskEnabled()) return false;
  const code = process.env.DESK_PASSCODE;
  if (!code) return true;
  const given = Buffer.from(req.headers.get("x-desk-passcode") ?? "");
  const want = Buffer.from(code);
  return given.length === want.length && timingSafeEqual(given, want);
}
