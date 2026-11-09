import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard, AuthGuard, type AuthenticatedRequest } from "../auth/auth.guard.js";
import { BanAccountDto } from "./users.dto.js";
import { UsersService } from "./users.service.js";

@Controller("users")
@UseGuards(AuthGuard, AdminGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch(":id/ban")
  setBanned(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: BanAccountDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.users.setBanned(request.user!.id, id, body.banned);
  }
}
