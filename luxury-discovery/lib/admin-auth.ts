/**
 * Optional passcode for the admin endpoints. When ADMIN_PASSCODE is unset (local
 * demo) the admin area is open; set it before putting the POC on a public URL.
 */
export function isAdmin(req: Request): boolean {
  const code = process.env.ADMIN_PASSCODE;
  if (!code) return true;
  return req.headers.get("x-admin-passcode") === code;
}

export const adminRequired = () => !!process.env.ADMIN_PASSCODE;
