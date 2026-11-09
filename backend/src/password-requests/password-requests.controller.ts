import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AdminGuard, AuthGuard, type AuthenticatedRequest } from "../auth/auth.guard.js";
import {
  CompletePasswordChangeRequestDto,
  CreatePasswordChangeRequestDto,
  ReviewPasswordChangeRequestDto,
} from "./password-request.dto.js";
import { PasswordRequestsService } from "./password-requests.service.js";

@Controller("password-change-requests")
@UseGuards(AuthGuard)
export class PasswordRequestsController {
  constructor(private readonly requests: PasswordRequestsService) {}

  @Get("mine")
  findMine(@Req() request: AuthenticatedRequest) {
    return this.requests.findMine(request.user!.id);
  }

  @Post()
  @Throttle({ default: { limit: 3, ttl: 3_600_000 } })
  create(
    @Body() body: CreatePasswordChangeRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requests.create(request.user!.id, body.message);
  }

  @Post("complete")
  complete(
    @Body() body: CompletePasswordChangeRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requests.complete(request.user!.id, body.newPassword);
  }

  @Get()
  @UseGuards(AdminGuard)
  findPending() {
    return this.requests.findPending();
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  review(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: ReviewPasswordChangeRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requests.review(id, request.user!.id, body.allow);
  }
}
