import { Module } from '@nestjs/common';
import { UserFollowingController } from './user-following.controller';
import { UserFollowingService } from './user-following.service';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [],
  controllers: [UserFollowingController],
  providers: [UserFollowingService, ArtistRepository, UserRepository],
})
export class followModule {}
