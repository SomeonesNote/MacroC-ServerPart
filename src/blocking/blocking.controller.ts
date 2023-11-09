import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Delete(':userId/unblockArtist/:artistId')
  unblockingArtist(
    @Param('userId') userId: number,
    @Param('artistId') artistId: number,
  ) {
    return this.blockingService.unblocking({ userId, artistId });
  }

  @Delete(':artistId/unblockUser/:userId')
  unblockingUser(
    @Param('userId') userId: number,
    @Param('artistId') artistId: number,
  ) {
    return this.blockingService.unblocking({ artistId, userId });
  }

  @Get(':id/blockedArtists')
  async getBlockedArtistsOfUser(@Param('id') userId: number) {
    return this.blockingService.getBlockedArtistsOfUser(userId);
  }

  @Get(':id/blockedUsers')
  async getBlockedUsersOfArtist(@Param('id') artistId: number) {
    return this.blockingService.getBlockedUsersOfArtist(artistId);
  }
}
