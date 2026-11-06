import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity.js";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createFirstAdmin(name: string, email: string, passwordHash: string) {
    return this.dataSource.transaction(async (manager) => {
      await manager.query("SELECT pg_advisory_xact_lock($1)", [73190421]);
      const users = manager.getRepository(User);
      const existing = await users.findOne({ where: { email } });

      if (existing) {
        throw new ConflictException("There's an account already using this email.");
      }

      const hasUsers = (await users.count()) > 0;
      return users.save(
        users.create({ name, email, passwordHash, isAdmin: !hasUsers }),
      );
    });
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.users.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  async updateProfile(id: string, name: string, email: string) {
    const user = await this.findById(id);
    const emailOwner = await this.users.findOne({ where: { email } });

    if (emailOwner && emailOwner.id !== id) {
      throw new ConflictException("This email address is already in use.");
    }

    user.name = name;
    user.email = email;
    return this.users.save(user);
  }

  async updatePassword(id: string, passwordHash: string) {
    const user = await this.findById(id);
    user.passwordHash = passwordHash;
    await this.users.save(user);
  }

  async remove(id: string) {
    const result = await this.users.delete(id);

    if (!result.affected) {
      throw new NotFoundException("User not found.");
    }
  }
}
