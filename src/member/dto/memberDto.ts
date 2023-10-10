import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class ArtistDto {
  @IsString()
  @IsNotEmpty()
  id: number;
}

export class MemberDto {
  @IsString()
  memberName: string;

  @IsString()
  @MinLength(4)
  memberInfo: string;

  @ValidateNested()
  @Type(() => ArtistDto)
  artist: ArtistDto;
}
