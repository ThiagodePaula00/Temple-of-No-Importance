import { IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreatePasswordChangeRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}

export class ReviewPasswordChangeRequestDto {
  @IsIn([true, false])
  allow: boolean;
}

export class CompletePasswordChangeRequestDto {
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  @Matches(/[0-9]/, {
    message: "Password must contain at least one number.",
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character.",
  })
  newPassword: string;
}
