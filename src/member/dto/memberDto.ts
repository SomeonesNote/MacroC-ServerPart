import { IsOptional, IsString, MinLength } from 'class-validator';

export class MemberDto {
  @IsString()
  memberName: string;

  @IsString()
  @MinLength(4)
  memberInfo: string;

  @IsString()
  @IsOptional()
  memberImage: string;
}
