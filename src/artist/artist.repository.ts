import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistRepository extends Repository<Artist> {
  constructor(dataSource: DataSource) {
    super(Artist, dataSource.createEntityManager());
  }
}
