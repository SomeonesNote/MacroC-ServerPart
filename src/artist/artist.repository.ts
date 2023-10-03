import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ArtistRepository extends Repository<Artist> {
  constructor(dataSource: DataSource) {
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

    await this.save(artist);
    console.log(`repository: ${user}`);
    return artist;
  }
}
