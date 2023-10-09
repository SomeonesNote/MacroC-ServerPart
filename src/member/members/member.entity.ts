import { BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Artist } from '../../artist/artist.entity';

export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberName: string;

  @Column()
  memberDescription: string;

  @Column({ nullable: true })
  memberImage: string;

  @ManyToOne(() => Artist, (artist) => artist.members, { eager: false })
  artist: Artist;
}
