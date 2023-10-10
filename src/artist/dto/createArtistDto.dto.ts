import { IsString, MinLength } from 'class-validator';

export class CreateArtistDto {
  artistId: number;

  @IsString()
  stageName: string;

  @IsString()
  genres: string;

  @IsString()
  @MinLength(4)
  artistInfo: string;

  // @IsString()
  // @IsOptional()
  // avatarUrl: string;
}
