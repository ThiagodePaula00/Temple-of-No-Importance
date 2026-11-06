import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { UsersService } from "../users/users.service.js";
import { toPublicUser, User } from "../users/user.entity.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    this.validatePasswordLength(password);
    const passwordHash = await hash(password, 12);
    const user = await this.users.createFirstAdmin(
      name.trim(),
      email.trim().toLowerCase(),
      passwordHash,
    );
    return toPublicUser(user);
  }

  async signIn(email: string, password: string) {
    const user = await this.users.findByEmail(email.trim().toLowerCase());

    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException("The email or password is incorrect.");
    }

    return {
      accessToken: await this.jwt.signAsync({ sub: user.id }),
      user: toPublicUser(user),
    };
  }

  async updateProfile(user: User, name: string, email: string) {
    return toPublicUser(
      await this.users.updateProfile(
        user.id,
        name.trim(),
        email.trim().toLowerCase(),
      ),
    );
  }

  async updatePassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ) {
    this.validatePasswordLength(newPassword);
    const currentUser = await this.users.findById(user.id);

    if (!(await compare(currentPassword, currentUser.passwordHash))) {
      throw new UnauthorizedException("The current password is incorrect.");
    }

    await this.users.updatePassword(user.id, await hash(newPassword, 12));
  }

  private validatePasswordLength(password: string) {
    if (Buffer.byteLength(password, "utf8") > 72) {
      throw new BadRequestException("Passwords must not exceed 72 bytes.");
    }
  }
}
