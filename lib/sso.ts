// Return destinations allowed after a successful login. All trusted apps share
// the localhost host during development, so any return origin must be one of
// these explicit allowlisted origins to block open-redirect attacks.
export const SSO_RETURN_ORIGIN = process.env.SSO_RETURN_ORIGIN ?? "http://localhost:3001";
export const SSO_ADMIN_ORIGIN = process.env.SSO_ADMIN_ORIGIN ?? "http://localhost:3000";

const ALLOWED_RETURN_ORIGINS = new Set(
  [SSO_RETURN_ORIGIN, SSO_ADMIN_ORIGIN]
    .map((origin) => origin.trim())
    .filter(Boolean)
);

export function safeReturnPath(next: string | null): string {
  if (!next) return "/dashboard";

  // Same-app navigation stays internal.
  if (next.startsWith("/")) return next;

  try {
    return ALLOWED_RETURN_ORIGINS.has(new URL(next).origin) ? next : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
