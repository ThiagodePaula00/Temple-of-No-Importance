import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity.js";
import { UsersService } from "./users.service.js";
import { RefreshToken } from "../auth/refresh-token.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
