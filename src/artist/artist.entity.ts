import { IsOptional } from 'class-validator';
import { User } from 'src/auth/user.entity';
import { Busking } from 'src/busking/busking.entity';
import { Member } from 'src/member/member.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @Column()
  genres: string;

  @Column()
  artistInfo: string;

  @Column()
  @IsOptional()
  instagramURL: string;

  @Column()
  @IsOptional()
  youtubeURL: string;

  @Column()
  @IsOptional()
  soundcloudURL: string;

  @Column()
  artistImage: string;

  @OneToOne(() => User, (user) => user.artist, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Member, (member) => member.artist, { eager: true })
  members: Member[];

  @OneToMany(() => Busking, (busking) => busking.artist, { eager: true })
  buskings: Busking[];

  @ManyToMany(() => User, (user) => user.following)
  // @JoinTable 'artist_followers_user' 삭제
  followers: User[];

  @ManyToMany(() => User, (user) => user.blockedArtists)
  blockedUsers: User[];
}
