import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service.js";
import { User } from "../users/user.entity.js";

type AuthenticatedRequest = {
  headers: { authorization?: string };
  user?: User;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Authentication is required.");
    }

    let payload: { sub: string; tokenType?: string };
    try {
      payload = await this.jwt.verifyAsync<{ sub: string }>(token);
    } catch {
      throw new UnauthorizedException("The session is invalid or has expired.");
    }

    if (payload.tokenType !== "access") {
      throw new UnauthorizedException("The session is invalid or has expired.");
    }

    try {
      request.user = await this.users.findById(payload.sub);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException("The session is invalid or has expired.");
      }
      throw error;
    }

    if (request.user.isBanned) {
      throw new ForbiddenException("This account has been banned.");
    }

    return true;
  }
}

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
  constructor(jwt: JwtService, users: UsersService) {
    super(jwt, users);
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.headers.authorization) return true;
    try {
      return await super.canActivate(context);
    } catch (error) {
      if (error instanceof ForbiddenException) {
        request.user = undefined;
        return true;
      }
      throw error;
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user?.isAdmin) {
      throw new ForbiddenException("Administrator access is required.");
    }

    return true;
  }
}

export type { AuthenticatedRequest };
