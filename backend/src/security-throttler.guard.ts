import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  InjectThrottlerOptions,
  InjectThrottlerStorage,
  ThrottlerGuard,
  type ThrottlerModuleOptions,
} from "@nestjs/throttler";
import type { ThrottlerStorage } from "@nestjs/throttler";

@Injectable()
export class SecurityThrottlerGuard extends ThrottlerGuard {
  constructor(
    @InjectThrottlerOptions() options: ThrottlerModuleOptions,
    @InjectThrottlerStorage() storage: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storage, reflector);
  }

  protected setResponseHeader(res: Record<string, unknown>, name: string, value: string | number) {
    if (name.startsWith("Retry-After") || name.includes("RateLimit-Reset")) {
      const milliseconds = Number(value);
      super.setResponseHeader(res, name, Number.isFinite(milliseconds) ? Math.ceil(milliseconds / 1000) : value);
      return;
    }
    super.setResponseHeader(res, name, value);
  }
}
