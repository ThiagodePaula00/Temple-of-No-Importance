export function coverImageSrc(url: string): string {
  try {
    const parsed = new URL(url, "http://localhost");
    const match = parsed.pathname.match(/^\/uploads\/([\w.-]+\.webp)$/);
    if (match) return `/api/uploads/${encodeURIComponent(match[1])}`;
  } catch {
    return url;
  }

  return url;
}
