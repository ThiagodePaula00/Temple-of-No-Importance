import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AdminGuard, AuthGuard, OptionalAuthGuard } from "./auth.guard.js";
import { RefreshToken } from "./refresh-token.entity.js";
import { AuthService } from "./auth.service.js";
import { UsersController } from "../users/users.controller.js";

const jwtSecret = process.env.JWT_SECRET_KEY;
const exampleJwtSecret =
  "generate-a-random-secret-key-with-at-least-32-characters";

if (
  !jwtSecret ||
  jwtSecret.length < 32 ||
  jwtSecret === exampleJwtSecret ||
  /placeholder|replace|set-a-random|change-me|example/i.test(jwtSecret)
) {
  throw new Error(
    "JWT_SECRET_KEY must contain at least 32 characters and must not use the example placeholder.",
  );
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
  controllers: [AuthController, UsersController],
  providers: [AuthService, AuthGuard, AdminGuard, OptionalAuthGuard],
  exports: [AuthGuard, AdminGuard, OptionalAuthGuard, JwtModule, UsersModule],
})
export class AuthModule {}
