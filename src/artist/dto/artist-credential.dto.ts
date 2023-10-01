import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ArtistCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  stageName: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  biography: string;

  // @IsString()
  // @IsOptional()
  // avatarUrl: string;
}
