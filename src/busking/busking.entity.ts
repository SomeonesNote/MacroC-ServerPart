import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Artist } from 'src/artist/artist.entity';

@Entity()
@Unique(['id'])
export class Busking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision' })
  longitude: number;

  @Column({ type: 'double precision' })
  latitude: number;

  @Column()
  BuskingInfo: string;

  @Column()
  BuskingStartTime: Date;

  @Column()
  BuskingEndTime: Date;

  @Column()
  stageName: string;

  @Column()
  artistImage: string;

  @ManyToOne(() => Artist, (artist) => artist.buskings, { eager: false })
  artist: Artist;
}
