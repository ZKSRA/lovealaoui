const DEFAULT_AUTH_REDIRECT = "/my-deck";

export function getSafeNextPath(value: string | null | undefined, fallback = DEFAULT_AUTH_REDIRECT) {
  const next = typeof value === "string" ? value.trim() : "";

  if (!next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(next, "https://lovealaoui.local");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function withQuery(pathname: string, params: Record<string, string | null | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
