import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './artist.repository';
import { UserRepository } from 'src/auth/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), AuthModule],
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository, UserRepository],
})
export class ArtistModule {}
