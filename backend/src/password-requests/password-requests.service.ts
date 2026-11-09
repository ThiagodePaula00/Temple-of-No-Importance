import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { DataSource, In, IsNull, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { RefreshToken } from "../auth/refresh-token.entity.js";
import { User } from "../users/user.entity.js";
import { PasswordChangeRequest } from "./password-change-request.entity.js";

@Injectable()
export class PasswordRequestsService {
  constructor(
    @InjectRepository(PasswordChangeRequest)
    private readonly requests: Repository<PasswordChangeRequest>,
    private readonly dataSource: DataSource,
  ) {}

  async findMine(userId: string) {
    const request = await this.requests.findOne({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return request ? this.toPublicRequest(request) : null;
  }

  async findPending() {
    const requests = await this.requests.find({
      where: { status: "pending" },
      relations: { user: true },
      order: { createdAt: "ASC" },
    });

    return requests.map((request) => ({
      ...this.toPublicRequest(request),
      user: {
        id: request.user.id,
        name: request.user.name,
        email: request.user.email,
      },
    }));
  }

  async create(userId: string, message?: string) {
    const normalizedMessage = message?.trim() || null;
    if (normalizedMessage && normalizedMessage.length > 500) {
      throw new BadRequestException("Messages must be 500 characters or fewer.");
    }

    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const user = await users.findOne({
        where: { id: userId },
        lock: { mode: "pessimistic_write" },
      });
      if (!user) throw new NotFoundException("User not found.");
      if (user.isAdmin) {
        throw new BadRequestException("Administrators can change their password directly.");
      }

      const requests = manager.getRepository(PasswordChangeRequest);
      const active = await requests.findOne({
        where: { userId, status: In(["pending", "approved"]) },
      });
      if (active) {
        throw new ConflictException("You already have an active password change request.");
      }

      const request = await requests.save(
        requests.create({ userId, message: normalizedMessage, status: "pending" }),
      );
      return this.toPublicRequest(request);
    });
  }

  async review(requestId: string, reviewerId: string, allow: boolean) {
    return this.dataSource.transaction(async (manager) => {
      const requests = manager.getRepository(PasswordChangeRequest);
      const request = await requests.findOne({
        where: { id: requestId },
        lock: { mode: "pessimistic_write" },
      });
      if (!request) throw new NotFoundException("Password change request not found.");
      if (request.status !== "pending") {
        throw new ConflictException("This request has already been reviewed.");
      }
      if (request.userId === reviewerId) {
        throw new ForbiddenException("You cannot review your own request.");
      }

      request.status = allow ? "approved" : "denied";
      request.reviewedById = reviewerId;
      request.reviewedAt = new Date();
      await requests.save(request);
      return this.toPublicRequest(request);
    });
  }

  async complete(userId: string, newPassword: string) {
    if (Buffer.byteLength(newPassword, "utf8") > 72) {
      throw new BadRequestException("Passwords must not exceed 72 bytes.");
    }
    const passwordHash = await hash(newPassword, 12);

    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const user = await users.findOne({
        where: { id: userId },
        lock: { mode: "pessimistic_write" },
      });
      if (!user) throw new NotFoundException("User not found.");
      if (user.isAdmin) {
        throw new BadRequestException("Administrators must use the account password form.");
      }

      const requests = manager.getRepository(PasswordChangeRequest);
      const request = await requests.findOne({
        where: { userId, status: "approved" },
        order: { reviewedAt: "DESC" },
        lock: { mode: "pessimistic_write" },
      });
      if (!request) {
        throw new ForbiddenException("An approved password change request is required.");
      }

      user.passwordHash = passwordHash;
      await users.save(user);
      await manager.getRepository(RefreshToken).update(
        { userId, revokedAt: IsNull() },
        { revokedAt: new Date() },
      );
      request.status = "completed";
      request.completedAt = new Date();
      await requests.save(request);

      return { status: request.status };
    });
  }

  private toPublicRequest(request: PasswordChangeRequest) {
    return {
      id: request.id,
      message: request.message,
      status: request.status,
      createdAt: request.createdAt,
      reviewedAt: request.reviewedAt,
      completedAt: request.completedAt,
    };
  }
}
