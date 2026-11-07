import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { DataSource, IsNull, LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "./refresh-token.entity.js";
import { UsersService } from "../users/users.service.js";
import { toPublicUser, User } from "../users/user.entity.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
    private readonly dataSource: DataSource,
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

    return { ...(await this.issueTokenPair(user)), user: toPublicUser(user) };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashRefreshToken(refreshToken);

    return this.dataSource.transaction(async (manager) => {
      const refreshTokens = manager.getRepository(RefreshToken);
      const currentToken = await refreshTokens.findOne({
        where: { tokenHash },
        lock: { mode: "pessimistic_write" },
      });

      if (
        !currentToken ||
        currentToken.revokedAt ||
        currentToken.expiresAt.getTime() <= Date.now()
      ) {
        throw new UnauthorizedException("The refresh token is invalid or has expired.");
      }

      const user = await manager
        .getRepository(User)
        .findOneBy({ id: currentToken.userId });

      if (!user) {
        throw new UnauthorizedException("The refresh token is invalid or has expired.");
      }

      currentToken.revokedAt = new Date();
      await refreshTokens.save(currentToken);

      return {
        ...(await this.issueTokenPair(user, refreshTokens)),
        user: toPublicUser(user),
      };
    });
  }

  async revokeRefreshToken(refreshToken: string) {
    await this.refreshTokens.update(
      { tokenHash: this.hashRefreshToken(refreshToken), revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
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
    await this.revokeAllRefreshTokens(user.id);
  }

  private async issueTokenPair(
    user: User,
    refreshTokens: Repository<RefreshToken> = this.refreshTokens,
  ) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, tokenType: "access" },
      { expiresIn: "15m" },
    );
    const refreshToken = randomBytes(64).toString("base64url");
    const now = Date.now();

    await refreshTokens.delete([
      { expiresAt: LessThan(new Date(now)) },
      { revokedAt: LessThan(new Date(now - REFRESH_TOKEN_TTL_MS)) },
    ]);

    await refreshTokens.save(
      refreshTokens.create({
        userId: user.id,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: new Date(now + REFRESH_TOKEN_TTL_MS),
        revokedAt: null,
      }),
    );

    return { accessToken, refreshToken };
  }

  private async revokeAllRefreshTokens(userId: string) {
    await this.refreshTokens.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  private hashRefreshToken(refreshToken: string) {
    return createHash("sha256").update(refreshToken).digest("hex");
  }

  private validatePasswordLength(password: string) {
    if (Buffer.byteLength(password, "utf8") > 72) {
      throw new BadRequestException("Passwords must not exceed 72 bytes.");
    }
  }
}
