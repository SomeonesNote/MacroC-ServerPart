import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserFollowingService } from './user-following.service';
import { User } from '../auth/user.entity';
import { Artist } from 'src/artist/artist.entity';

@Controller('user-following')
export class UserFollowingController {
  constructor(private readonly userFollowingService: UserFollowingService) {}

  @Post(':userId/follow/:artistId')
  followArtist(
    @Param('userId') userId: number,
    @Param('artistId') artistId: number,
  ) {
    const user = new User();
    user.id = userId;

    const artist = new Artist();
    artist.id = artistId;

    return this.userFollowingService.followArtist(userId, artistId);
  }

  @Delete(':userId/unfollow/:artistId')
  unfollowArtist(
    @Param('userId') userId: number,
    @Param('artistId') artistId: number,
  ) {
    return this.userFollowingService.unfollowArtist(userId, artistId);
  }

  @Get(':id/followers')
  async getFollowersOfArtist(@Param('id') artistId: number): Promise<User[]> {
    return this.userFollowingService.getFollowersOfArtist(artistId);
  }

  @Get(':id/following')
  async getFollowersOfUser(@Param('id') userId: number): Promise<Artist[]> {
    return this.userFollowingService.getFollowingOfUser(userId);
  }
}
