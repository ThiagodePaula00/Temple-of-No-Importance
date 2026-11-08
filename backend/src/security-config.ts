export function parseOrigins(raw: string | undefined, production: boolean): string[] {
  const values = raw?.split(",").map((value) => value.trim()).filter(Boolean);
  if (!values?.length) {
    if (production) throw new Error("CORS_ORIGINS must contain the production frontend origin.");
    return ["http://localhost:3001"];
  }
  return values.map((value) => {
    let url: URL;
    try { url = new URL(value); } catch { throw new Error(`Invalid CORS origin: ${value}`); }
    if (url.origin !== value || !["http:", "https:"].includes(url.protocol) || (production && url.protocol !== "https:")) {
      throw new Error(`CORS_ORIGINS entries must be bare${production ? " HTTPS" : ""} origins: ${value}`);
    }
    return url.origin;
  });
}

export function trustedProxies(raw = process.env.TRUSTED_PROXIES): string[] {
  const value = raw?.trim();
  if (!value) return [];
  const entries = value.split(",").map((entry) => entry.trim()).filter(Boolean);
  if (!entries.length || entries.some((entry) => ["*", "true", "false", "loopback", "uniquelocal"].includes(entry.toLowerCase()) || /^\d+$/.test(entry))) {
    throw new Error("TRUSTED_PROXIES must list explicit trusted proxy IPs or CIDRs; broad and hop-count values are not allowed.");
  }
  return entries;
}

export function positiveInteger(raw: string | undefined, fallback: number, name: string): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return value;
}
