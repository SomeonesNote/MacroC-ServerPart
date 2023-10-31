import { Controller, Param, Post } from '@nestjs/common';
import { BlockingService } from './blocking.service';

@Controller('blocking')
export class BlockingController {
  constructor(private blockingService: BlockingService) {}

  @Post(':userId/blockArtist/:artistId')
  blockingArtist(
    @Param('userId') userId: number,
    @Param('artistId') artistId: number,
  ) {
    return this.blockingService.blocking({ userId, artistId });
  }

  @Post(':artistId/blockUser/:userId')
  blockingUser(
    @Param('userId') userId: number,
    @Param('artistId') artistId: number,
  ) {
    return this.blockingService.blocking({ artistId, userId });
  }
}
