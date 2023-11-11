import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BuskingDto {
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;

  @IsString()
  @IsNotEmpty()
  BuskingInfo: string;

  @IsNotEmpty()
  BuskingStartTime: Date;

  @IsNotEmpty()
  BuskingEndTime: Date;

  @IsString()
  @IsNotEmpty()
  stageName: string;

  @IsString()
  @IsOptional()
  artistImage: string;
}
