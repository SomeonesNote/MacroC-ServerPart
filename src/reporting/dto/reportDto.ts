import { IsInt, IsString } from 'class-validator';

export class ReportDto {
  @IsInt()
  userId: number;

  @IsInt()
  artistId: number;

  @IsString()
  reporting: string;
}
