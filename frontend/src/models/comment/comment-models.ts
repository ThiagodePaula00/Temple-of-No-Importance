export type CommentVoteValue = "like" | "dislike";

export type CommentModel = {
  id: string;
  postId: string;
  parentId: string | null;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    isAdmin?: boolean;
    isBanned?: boolean;
  };
  likeCount: number;
  dislikeCount: number;
  myVote: CommentVoteValue | null;
};
