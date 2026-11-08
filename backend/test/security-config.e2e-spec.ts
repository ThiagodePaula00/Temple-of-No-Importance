import { describe, expect, it } from "vitest";
import { parseOrigins, positiveInteger, trustedProxies } from "../src/security-config.js";

describe("security configuration", () => {
  it("uses the local frontend origin in development and accepts multiple configured origins", () => {
    expect(parseOrigins(undefined, false)).toEqual(["http://localhost:3001"]);
    expect(parseOrigins("https://blog.example.com, https://admin.example.com", true)).toEqual([
      "https://blog.example.com",
      "https://admin.example.com",
    ]);
  });

  it("fails closed for missing, wildcard, path-bearing, or insecure production origins", () => {
    expect(() => parseOrigins(undefined, true)).toThrow(/CORS_ORIGINS/);
    expect(() => parseOrigins("*", true)).toThrow();
    expect(() => parseOrigins("https://blog.example.com/path", true)).toThrow();
    expect(() => parseOrigins("http://blog.example.com", true)).toThrow();
  });

  it("only trusts explicitly listed proxy addresses", () => {
    expect(trustedProxies(undefined)).toEqual([]);
    expect(trustedProxies("10.1.2.3, 192.168.0.0/24")).toEqual(["10.1.2.3", "192.168.0.0/24"]);
    expect(() => trustedProxies("*")).toThrow(/explicit trusted proxy/);
    expect(() => trustedProxies("1")).toThrow(/explicit trusted proxy/);
  });

  it("accepts positive rate limit values and rejects invalid values", () => {
    expect(positiveInteger(undefined, 120, "RATE_LIMIT_MAX")).toBe(120);
    expect(positiveInteger("30", 120, "RATE_LIMIT_MAX")).toBe(30);
    expect(() => positiveInteger("0", 120, "RATE_LIMIT_MAX")).toThrow(/positive integer/);
    expect(() => positiveInteger("abc", 120, "RATE_LIMIT_MAX")).toThrow(/positive integer/);
  });
});
