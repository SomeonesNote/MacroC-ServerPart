import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Busking } from './busking.entity';
import { BuskingDto } from './dto/buskingDto';
import { Artist } from 'src/artist/artist.entity';

@Injectable()
export class BuskingRepository extends Repository<Busking> {
  constructor(dataSource: DataSource) {
    super(Busking, dataSource.createEntityManager());
  }

  async createBusking(
    buskingDto: BuskingDto,
    artist: Artist,
  ): Promise<Busking> {
    const {
      longitude,
      latitude,
      BuskingInfo,
      BuskingStartTime,
      BuskingEndTime,
    } = buskingDto;

    const busking = this.create({
      longitude,
      latitude,
      BuskingInfo,
      BuskingStartTime,
      BuskingEndTime,
      artist,
    });

    await this.save(busking);
    return busking;
  }
}
