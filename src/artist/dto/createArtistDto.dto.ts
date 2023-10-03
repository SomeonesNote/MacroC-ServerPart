import { IsString, MinLength } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  stageName: string;

  @IsString()
  @MinLength(4)
  biography: string;

  // @IsString()
  // @IsOptional()
  // avatarUrl: string;
}
