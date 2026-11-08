import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard, type AuthenticatedRequest } from "./auth.guard.js";
import {
  ChangePasswordDto,
  RefreshTokenDto,
  SignInDto,
  SignUpDto,
  UpdateProfileDto,
} from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { toPublicUser } from "../users/user.entity.js";
import { UsersService } from "../users/users.service.js";
import { Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Post("sign-up")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  signUp(@Body() body: SignUpDto) {
    return this.auth.signUp(body.name, body.email, body.password);
  }

  @Post("sign-in")
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() body: SignInDto) {
    return this.auth.signIn(body.email, body.password);
  }

  @Post("refresh")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: RefreshTokenDto) {
    return this.auth.refresh(body.refreshToken);
  }

  @Post("logout")
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body() body: RefreshTokenDto) {
    await this.auth.revokeRefreshToken(body.refreshToken);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async getCurrentUser(@Req() request: AuthenticatedRequest) {
    return toPublicUser(await this.users.findById(request.user!.id));
  }

  @Patch("me")
  @UseGuards(AuthGuard)
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateProfileDto,
  ) {
    return this.auth.updateProfile(request.user!, body.name, body.email);
  }

  @Patch("me/password")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(
    @Req() request: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    await this.auth.updatePassword(
      request.user!,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Delete("me")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Req() request: AuthenticatedRequest) {
    await this.users.remove(request.user!.id);
  }
}
