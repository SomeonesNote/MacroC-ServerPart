import { Module } from '@nestjs/common';
import { BuskingService } from './busking.service';
import { BuskingController } from './busking.controller';

@Module({
  providers: [BuskingService],
  controllers: [BuskingController],
})
export class BuskingModule {}
