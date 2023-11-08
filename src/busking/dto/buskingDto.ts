import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BuskingDto {
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  BuskingInfo: string;

  @IsNotEmpty()
  BuskingStartTime: Date;

  @IsNotEmpty()
  BuskingEndTime: Date;

  @IsString()
  @IsOptional()
  artistImage: string;
}
