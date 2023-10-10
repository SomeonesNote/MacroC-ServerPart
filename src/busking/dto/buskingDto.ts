import { IsNotEmpty } from 'class-validator';

export class BuskingDto {
  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  BuskingInfo: string;

  @IsNotEmpty()
  BuskingStartTime: string;

  @IsNotEmpty()
  BuskingEndTime: string;
}

// 37.5797, 126.9771
// 37.5797, 126.9768
