import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text", name: "password_hash" })
  passwordHash: string;

  @Column({ type: "boolean", default: false })
  isAdmin: boolean;

  @Column({ type: "boolean", name: "is_banned", default: false })
  isBanned: boolean;

  @Column({ type: "timestamp", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}

export type PublicUser = Pick<User, "id" | "name" | "email" | "isAdmin">;

export function toPublicUser(user: User): PublicUser {
  const { id, name, email, isAdmin } = user;
  return { id, name, email, isAdmin };
}
