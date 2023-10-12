import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ArtistCreateController } from './artist.create.controller';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { UserRepository } from 'src/auth/user.repository';
import { UserFollowingController } from 'src/follow/user-following.controller';
import { UserFollowingService } from 'src/follow/user-following.service';
import { UploadImageServce } from 'src/upload/uploadImage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), AuthModule],
  controllers: [
    ArtistCreateController,
    ArtistController,
    UserFollowingController,
  ],
  providers: [
    ArtistService,
    ArtistRepository,
    UserRepository,
    UserFollowingService,
    UploadImageServce,
  ],
})
export class ArtistModule {}
