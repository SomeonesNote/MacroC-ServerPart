import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and numbers',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsOptional()
  avatar: Buffer;

  @IsString()
  @IsOptional()
  avatarUrl: string;
}
