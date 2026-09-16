export const DEFAULT_REDIRECT = "/home";

// Only allow same-origin relative paths, so `?from=` can't be used as an
// open redirect (e.g. "//evil.com" or "https://evil.com").
export const safeRedirect = (target: unknown): string => {
  if (typeof target !== "string") return DEFAULT_REDIRECT;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return DEFAULT_REDIRECT;
  }
  if (target === "/auth" || target.startsWith("/auth?") || target.startsWith("/auth/")) {
    return DEFAULT_REDIRECT;
  }
  return target;
};

export const authHref = (from: string | null | undefined): string => {
  if (!from || from === "/" || from.startsWith("/auth")) return "/auth";
  return `/auth?from=${encodeURIComponent(from)}`;
};
