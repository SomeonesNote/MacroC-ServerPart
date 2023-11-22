import { IsOptional, IsString, MinLength } from 'class-validator';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';
import { BuskingDto } from 'src/busking/dto/buskingDto';

export class CreateArtistDto {
  artistId: number;

  @IsString()
  stageName: string;

  @IsString()
  genres: string;

  @IsString()
  @MinLength(1)
  artistInfo: string;

  @IsString()
  @IsOptional()
  instagramURL: string;

  @IsString()
  @IsOptional()
  youtubeURL: string;

  @IsString()
  @IsOptional()
  soundcloudURL: string;

  @IsString()
  @IsOptional()
  artistImage: string;

  user: AuthCredentialsDto;

  // members: MemberDto[];

  buskings: BuskingDto[];
}
