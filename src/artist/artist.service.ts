import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistRepository } from './artist.repository';
import { User } from 'src/auth/user.entity';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
  ) {}

  async createArtist(
    user: User,
    createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistRepository.createArtist(createArtistDto, user);
  }

  async getAllArtiists(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async getArtistByName(stageName: string): Promise<Artist> {
    const found = await this.artistRepository.findOneBy({ stageName });

    if (!found) {
      throw new NotFoundException(`Artist with ID "${stageName}" not found`);
    }
    return found;
  }
}
