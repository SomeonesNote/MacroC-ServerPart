import {
  BaseEntity,
  Column,
  Entity,
  //   ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
// import { Artist } from 'src/artist/artist.entity';

@Entity()
@Unique(['id'])
export class Busking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column()
  BuskingInfo: string;

  @Column()
  BuskingStartTIme: Date;

  @Column()
  BuskingEndTIme: Date;

  //   @ManyToOne(() => Artist, (artist) => artist.busking, { eager: false })
  //   artist: Artist;
}
