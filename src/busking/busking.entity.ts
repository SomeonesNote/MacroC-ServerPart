import {
  BaseEntity,
  Column,
  Entity,
  // JoinColumn,
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
  BuskingStartTime: string;
  // BuskingStartTime: Date;

  @Column()
  BuskingEndTime: string;
  // BuskingEndTime: Date;

  @ManyToOne(() => Artist, (artist) => artist.buskings, { eager: false })
  artist: Artist;
}
