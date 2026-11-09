import { IsIn } from "class-validator";

export class BanAccountDto {
  @IsIn([true, false])
  banned: boolean;
}
