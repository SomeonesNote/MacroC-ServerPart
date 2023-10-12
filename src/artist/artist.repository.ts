import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class ArtistRepository extends Repository<Artist> {
  constructor(
    dataSource: DataSource,
    private userRepository: UserRepository,
  ) {
    super(Artist, dataSource.createEntityManager());
  }

  async createArtist(
    createArtistDto: CreateArtistDto,
    user: User,
  ): Promise<Artist> {
    const { stageName, artistInfo, genres, artistImage } = createArtistDto;

    const artist = this.create({
      stageName,
      artistInfo,
      genres,
      artistImage,
      user,
    });

    user.artist = artist;

    try {
      await this.save(artist);
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Artist : '${stageName}' already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    return artist;
  }
}
