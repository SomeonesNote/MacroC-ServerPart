import { Injectable, NotFoundException } from '@nestjs/common';
import { BuskingRepository } from './busking.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BuskingDto } from './dto/buskingDto';
import { Busking } from './busking.entity';
import { ArtistRepository } from 'src/artist/artist.repository';

@Injectable()
export class BuskingService {
  constructor(
    @InjectRepository(BuskingRepository)
    private buskingRepository: BuskingRepository,
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
  ) {}

  async createBusking(
    buskingDto: BuskingDto,
    artistId: number,
  ): Promise<Busking> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    return await this.buskingRepository.createBusking(buskingDto, artist);
  }

  async getAllBusking(artistId: number): Promise<Busking[]> {
    const query = this.buskingRepository.createQueryBuilder('busking');
    query.where('busking.artistId = :artistId', { artistId });
    const buskings = await query.getMany();
    return buskings;
  }

  async getBuskingById(id: number): Promise<Busking> {
    const found = await this.buskingRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(
        `Busking Performance with ID "${id}" not found`,
      );
    }
    return found;
  }

  async deleteBuskingById(id: number, artistId: number): Promise<void> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    const result = await this.buskingRepository.delete({
      id,
      artist: { id: artist.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Busking Performance with ID "${id}" not found`,
      );
    }
  }
}
