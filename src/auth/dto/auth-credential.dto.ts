import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  email: string;

  @IsString()
  uid: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}
export class UpdatableUserInfos {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}
