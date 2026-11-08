import type { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Throttle, ThrottlerException, type ThrottlerStorage } from "@nestjs/throttler";
import { describe, expect, it, vi } from "vitest";
import { SecurityThrottlerGuard } from "../src/security-throttler.guard.js";

class TestableGuard extends SecurityThrottlerGuard {
  constructor(storage: ThrottlerStorage = {} as ThrottlerStorage) {
    super([{ ttl: 60_000, limit: 100 }], storage, new Reflector());
  }
  writeHeader(response: Record<string, unknown>, name: string, value: string | number) {
    return this.setResponseHeader(response, name, value);
  }
}

class LimitedController {
  @Throttle({ default: { limit: 2, ttl: 60_000 } })
  get(this: void) { return "ok"; }
}

describe("API security response configuration", () => {
  it("converts throttler millisecond durations into valid Retry-After seconds", () => {
    const setHeader = vi.fn();
    const guard = new TestableGuard();
    guard.writeHeader({ setHeader }, "Retry-After", 59_210);
    guard.writeHeader({ setHeader }, "X-RateLimit-Reset", 60_000);
    expect(setHeader).toHaveBeenNthCalledWith(1, "Retry-After", 60);
    expect(setHeader).toHaveBeenNthCalledWith(2, "X-RateLimit-Reset", 60);
  });

  it("preserves numeric limit metadata", () => {
    const setHeader = vi.fn();
    new TestableGuard().writeHeader({ setHeader }, "X-RateLimit-Limit", 120);
    expect(setHeader).toHaveBeenCalledWith("X-RateLimit-Limit", 120);
  });

  it("blocks the third request with 429 and emits Retry-After", async () => {
    let hitCount = 0;
    const storage: ThrottlerStorage = {
      async increment() {
        hitCount += 1;
        return {
          totalHits: hitCount,
          timeToExpire: 60_000,
          isBlocked: hitCount > 2,
          timeToBlockExpire: 59_210,
        };
      },
    };
    const guard = new TestableGuard(storage);
    await guard.onModuleInit();
    const headers = new Map<string, string | number>();
    const response = { setHeader: (key: string, value: string | number) => headers.set(key, value) };
    const context = {
      getHandler: () => LimitedController.prototype.get,
      getClass: () => LimitedController,
      switchToHttp: () => ({ getRequest: () => ({ ip: "127.0.0.1", headers: {} }), getResponse: () => response }),
    } as unknown as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(true);
    expect(await guard.canActivate(context)).toBe(true);
    await expect(guard.canActivate(context)).rejects.toMatchObject({
      constructor: ThrottlerException,
      status: 429,
    });
    expect(headers.get("Retry-After")).toBe(60);
  });
});
