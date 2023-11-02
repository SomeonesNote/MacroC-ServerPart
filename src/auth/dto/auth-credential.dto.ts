import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  uid: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}

export class SignInCredentialsDto {
  @IsString()
  uid: string;
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
