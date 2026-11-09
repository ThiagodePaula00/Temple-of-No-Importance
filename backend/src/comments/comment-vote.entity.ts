import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Column,
} from "typeorm";
import { Comment } from "./comment.entity.js";
import { User } from "../users/user.entity.js";

export type CommentVoteValue = "like" | "dislike";

@Entity({ name: "comment_votes" })
export class CommentVote {
  @PrimaryColumn({ type: "uuid", name: "comment_id" })
  commentId: string;

  @ManyToOne(() => Comment, { onDelete: "CASCADE" })
  @JoinColumn({ name: "comment_id" })
  comment: Comment;

  @PrimaryColumn({ type: "uuid", name: "user_id" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "text" })
  value: CommentVoteValue;

  @CreateDateColumn({ type: "timestamp", name: "created_at" })
  createdAt: Date;
}
