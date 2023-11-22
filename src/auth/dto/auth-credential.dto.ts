import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  email: string;

  @IsString()
  uid: string;

  @IsString()
  @MinLength(1)
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

export class UsernameCredentialsDto {
  @IsString()
  username: string;
}

export class UpdatableUserInfos {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}
