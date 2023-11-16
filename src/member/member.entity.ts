import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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

  // @ManyToOne(() => Artist, (artist) => artist.members, { eager: false })
  // artist: Artist;
}
