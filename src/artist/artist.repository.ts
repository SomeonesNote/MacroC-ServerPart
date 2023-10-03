import { Injectable } from '@nestjs/common';
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
    const { stageName, biography } = createArtistDto;

    const artist = this.create({
      stageName,
      biography,
      user,
    });

    user.artist = artist;

    await this.save(artist);
    await this.userRepository.save(user);
    return artist;
  }
}
