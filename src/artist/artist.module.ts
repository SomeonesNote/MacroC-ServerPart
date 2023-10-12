import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistCreateController } from './artist.create.controller';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { UserRepository } from 'src/auth/user.repository';
import { UserFollowingController } from 'src/follow/user-following.controller';
import { UserFollowingService } from 'src/follow/user-following.service';
import { UploadImageServce } from 'src/upload/uploadImage.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
        limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
      }),
      inject: [ConfigService],
    }),
  ],
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
