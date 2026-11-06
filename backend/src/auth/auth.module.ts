import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AdminGuard, AuthGuard } from "./auth.guard.js";
import { AuthService } from "./auth.service.js";

const jwtSecret = process.env.JWT_SECRET_KEY;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET_KEY must contain at least 32 characters.");
}

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard],
  exports: [AuthGuard, AdminGuard, JwtModule, UsersModule],
})
export class AuthModule {}
