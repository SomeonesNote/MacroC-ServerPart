import { Module } from '@nestjs/common';
import { BlockingService } from './blocking.service';
import { BlockingController } from './blocking.controller';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [],
  controllers: [BlockingController],
  providers: [BlockingService, ArtistRepository, UserRepository],
})
export class BlockingModule {}
