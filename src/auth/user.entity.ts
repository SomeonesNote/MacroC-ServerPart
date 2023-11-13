import { Artist } from 'src/artist/artist.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  uid: string;

  @Column()
  username: string;

  @Column({ comment: 's3 업로드된 localtion url' })
  avatarUrl: string;

  @OneToOne(() => Artist, (artist) => artist.user, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToMany(() => Artist, (artist) => artist.followers)
  @JoinTable({
    name: 'user_following_artist', // 중간 테이블의 이름 설정
    joinColumn: {
      name: 'userId', // 아티스트의 ID와 연결
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'artistId', // 유저의 ID와 연결
      referencedColumnName: 'id',
    },
  })
  following: Artist[];

  @ManyToMany(() => Artist, (artist) => artist.blockedUsers)
  @JoinTable({
    name: 'user_block_artist', // 중간 테이블의 이름 설정
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'artistId',
      referencedColumnName: 'id',
    },
  })
  blockedArtists: Artist[];
}
