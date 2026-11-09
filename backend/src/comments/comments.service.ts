import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "../posts/post.entity.js";
import { User } from "../users/user.entity.js";
import { Comment } from "./comment.entity.js";
import { CommentVote, type CommentVoteValue } from "./comment-vote.entity.js";
import { CreateCommentDto } from "./comment.dto.js";

const MAX_THREAD_DEPTH = 20;
const MAX_COMMENTS = 200;

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(CommentVote)
    private readonly votes: Repository<CommentVote>,
    @InjectRepository(Post) private readonly posts: Repository<Post>,
    private readonly dataSource: DataSource,
  ) {}

  async findForPost(postId: string, viewerId?: string, viewerIsAdmin = false) {
    const post = await this.posts.findOne({
      where: { id: postId, published: true },
      select: { id: true },
    });
    if (!post) throw new NotFoundException("Post not found.");

    const comments = await this.comments.find({
      where: { postId },
      relations: { author: true },
      order: { createdAt: "DESC" },
      take: MAX_COMMENTS,
    });
    comments.reverse();
    if (!comments.length) return [];

    const ids = comments.map((comment) => comment.id);
    const voteRows = await this.votes
      .createQueryBuilder("vote")
      .select("vote.commentId", "commentId")
      .addSelect("SUM(CASE WHEN vote.value = 'like' THEN 1 ELSE 0 END)", "likes")
      .addSelect("SUM(CASE WHEN vote.value = 'dislike' THEN 1 ELSE 0 END)", "dislikes")
      .where("vote.commentId IN (:...ids)", { ids })
      .groupBy("vote.commentId")
      .getRawMany<{ commentId: string; likes: string; dislikes: string }>();
    const counts = new Map(voteRows.map((row) => [row.commentId, row]));

    const viewerVotes = viewerId
      ? await this.votes.find({ where: { commentId: In(ids), userId: viewerId } })
      : [];
    const viewerVoteMap = new Map(
      viewerVotes.map((vote) => [vote.commentId, vote.value]),
    );

    return comments.map((comment) => {
      const count = counts.get(comment.id);
      return {
        id: comment.id,
        postId: comment.postId,
        parentId: comment.parentId,
        body: comment.body,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          ...(viewerIsAdmin
            ? { isAdmin: comment.author.isAdmin, isBanned: comment.author.isBanned }
            : {}),
        },
        likeCount: Number(count?.likes ?? 0),
        dislikeCount: Number(count?.dislikes ?? 0),
        myVote: viewerVoteMap.get(comment.id) ?? null,
      };
    });
  }

  async create(author: User, input: CreateCommentDto) {
    const body = input.body.trim();
    if (!body) throw new BadRequestException("Comment cannot be empty.");
    if (body.length > 2000) {
      throw new BadRequestException("Comments must be 2,000 characters or fewer.");
    }

    const post = await this.posts.findOne({
      where: { id: input.postId, published: true },
      select: { id: true },
    });
    if (!post) throw new NotFoundException("Post not found.");

    let parentId: string | null = null;
    if (input.parentId) {
      const parent = await this.comments.findOne({
        where: { id: input.parentId, postId: input.postId },
      });
      if (!parent) throw new NotFoundException("Comment to reply to was not found.");
      if ((await this.getDepth(parent)) >= MAX_THREAD_DEPTH) {
        throw new BadRequestException("This reply thread is too deep.");
      }
      parentId = parent.id;
    }

    const saved = await this.comments.save(
      this.comments.create({
        postId: input.postId,
        authorId: author.id,
        parentId,
        body,
      }),
    );

    return {
      id: saved.id,
      postId: saved.postId,
      parentId: saved.parentId,
      body: saved.body,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      author: { id: author.id, name: author.name },
      likeCount: 0,
      dislikeCount: 0,
      myVote: null,
    };
  }

  async vote(commentId: string, userId: string, vote: CommentVoteValue | null) {
    return this.dataSource.transaction(async (manager) => {
      const comments = manager.getRepository(Comment);
      const votes = manager.getRepository(CommentVote);
      const comment = await comments.findOne({
        where: { id: commentId },
        lock: { mode: "pessimistic_write" },
      });
      if (!comment) throw new NotFoundException("Comment not found.");

      const current = await votes.findOne({ where: { commentId, userId } });
      if (vote === null || current?.value === vote) {
        if (current) await votes.remove(current);
        return { commentId, myVote: null };
      } else if (current) {
        current.value = vote;
        await votes.save(current);
      } else {
        await votes.save(votes.create({ commentId, userId, value: vote }));
      }

      return { commentId, myVote: vote };
    });
  }

  async update(commentId: string, userId: string, body: string) {
    const comment = await this.comments.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException("Comment not found.");
    if (comment.authorId !== userId) {
      throw new ForbiddenException("You can only edit your own comments.");
    }

    const normalizedBody = body.trim();
    if (!normalizedBody) throw new BadRequestException("Comment cannot be empty.");
    if (normalizedBody.length > 2000) {
      throw new BadRequestException("Comments must be 2,000 characters or fewer.");
    }

    comment.body = normalizedBody;
    return this.comments.save(comment);
  }

  async remove(commentId: string, userId: string, isAdmin: boolean) {
    const comment = await this.comments.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException("Comment not found.");
    if (!isAdmin && comment.authorId !== userId) {
      throw new ForbiddenException("You can only delete your own comments.");
    }

    await this.comments.remove(comment);
  }

  private async getDepth(comment: Comment) {
    let depth = 0;
    let current = comment;
    while (current.parentId) {
      depth += 1;
      if (depth >= MAX_THREAD_DEPTH) return depth;
      const parent = await this.comments.findOne({
        where: { id: current.parentId },
        select: { id: true, parentId: true },
      });
      if (!parent) break;
      current = parent;
    }
    return depth;
  }
}
