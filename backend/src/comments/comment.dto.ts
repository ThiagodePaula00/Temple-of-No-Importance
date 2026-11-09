import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

export class GetCommentsDto {
  @IsUUID()
  postId: string;
}

export class CreateCommentDto {
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body: string;
}

export class VoteCommentDto {
  @IsIn(["like", "dislike", null])
  vote: "like" | "dislike" | null;
}

