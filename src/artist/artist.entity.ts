import { User } from 'src/auth/user.entity';
import { Busking } from 'src/busking/busking.entity';
import { Member } from 'src/member/member.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['stageName'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @Column()
  genres: string;

  @Column()
  artistInfo: string;

  @Column({ nullable: true })
  artistImage: string;

  @OneToOne(() => User, (user) => user.artist, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'artist_followers_user',
    joinColumn: {
      name: 'artistId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  followers: User[];

  @OneToMany(() => Member, (member) => member.artist, { eager: true })
  members: Member[];

  @OneToMany(() => Busking, (busking) => busking.artist, { eager: true })
  buskings: Busking[];
}
