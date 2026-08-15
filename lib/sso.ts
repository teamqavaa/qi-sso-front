// Only the practice-lab origin (or a same-app path) may follow a login.
// This blocks open-redirect attacks through the `next` query parameter.
const SSO_RETURN_ORIGIN = process.env.SSO_RETURN_ORIGIN ?? "http://localhost:3001";

export function safeReturnPath(next: string | null): string {
  if (!next) return "/dashboard";

  if (next.startsWith("/")) return next;

  try {
    return new URL(next).origin === SSO_RETURN_ORIGIN ? next : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
