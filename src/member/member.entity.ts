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
@Unique(['memberName'])
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberName: string;

  @Column()
  memberInfo: string;

  @Column()
  memberImage: string;

  @ManyToOne(() => Artist, (artist) => artist.members, { eager: false })
  artist: Artist;
}
