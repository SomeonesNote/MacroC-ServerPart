import { Module } from '@nestjs/common';
import { BuskingService } from './busking.service';
import { BuskingController } from './busking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Busking } from './busking.entity';
import { BuskingRepository } from './busking.repository';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Busking])],
  controllers: [BuskingController],
  providers: [
    BuskingService,
    BuskingRepository,
    ArtistRepository,
    UserRepository,
  ],
})
export class BuskingModule {}
