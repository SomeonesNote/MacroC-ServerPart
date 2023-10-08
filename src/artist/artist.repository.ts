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
    const { stageName, biography } = createArtistDto;

    const artist = this.create({
      stageName,
      biography,
      user,
    });

    user.artist = artist;

    try {
      await this.save(artist);
      await this.userRepository.save(user);
      console.log('artist saved to the database:', artist); // 데이터베이스에 저장된 사용자 정보 출력
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
