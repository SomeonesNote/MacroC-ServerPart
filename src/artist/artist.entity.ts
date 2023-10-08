import { User } from 'src/auth/user.entity';
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
@Unique(['stageName'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @Column({ nullable: true })
  biography: string;

  @OneToOne(() => User, (user) => user.artist, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'artist_followers_user', // 중간 테이블의 이름 설정
    joinColumn: {
      name: 'artistId', // 아티스트의 ID와 연결
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId', // 유저의 ID와 연결
      referencedColumnName: 'id',
    },
  })
  followers: User[];
}
