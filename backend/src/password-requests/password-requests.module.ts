import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module.js";
import { RefreshToken } from "../auth/refresh-token.entity.js";
import { User } from "../users/user.entity.js";
import { PasswordChangeRequest } from "./password-change-request.entity.js";
import { PasswordRequestsController } from "./password-requests.controller.js";
import { PasswordRequestsService } from "./password-requests.service.js";

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordChangeRequest, User, RefreshToken]),
    AuthModule,
  ],
  controllers: [PasswordRequestsController],
  providers: [PasswordRequestsService],
})
export class PasswordRequestsModule {}
