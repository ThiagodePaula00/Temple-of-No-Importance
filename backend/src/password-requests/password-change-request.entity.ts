import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { User } from "../users/user.entity.js";

export type PasswordChangeRequestStatus =
  | "pending"
  | "approved"
  | "denied"
  | "completed";

@Entity({ name: "password_change_requests" })
@Index("password_change_requests_status_created_idx", ["status", "createdAt"])
@Index("password_change_requests_user_created_idx", ["userId", "createdAt"])
export class PasswordChangeRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text", nullable: true })
  message: string | null;

  @Column({ type: "text", default: "pending" })
  status: PasswordChangeRequestStatus;

  @Column({ type: "uuid", name: "reviewed_by_id", nullable: true })
  reviewedById: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "reviewed_by_id" })
  reviewedBy: User | null;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;

  @Column({ type: "timestamp", name: "reviewed_at", nullable: true })
  reviewedAt: Date | null;

  @Column({ type: "timestamp", name: "completed_at", nullable: true })
  completedAt: Date | null;
}
