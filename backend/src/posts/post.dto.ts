import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(500)
  excerpt: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverImageUrl?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
