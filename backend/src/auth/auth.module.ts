import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AdminGuard, AuthGuard } from "./auth.guard.js";
import { RefreshToken } from "./refresh-token.entity.js";
import { AuthService } from "./auth.service.js";

const jwtSecret = process.env.JWT_SECRET_KEY;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET_KEY must contain at least 32 characters.");
}

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: "15m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard],
  exports: [AuthGuard, AdminGuard, JwtModule, UsersModule],
})
export class AuthModule {}
