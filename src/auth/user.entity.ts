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
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ comment: 's3 업로드된 localtion url' })
  avatarUrl: string;

  @OneToOne(() => Artist, (artist) => artist.user, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @ManyToMany(() => Artist, (artist) => artist.followers)
  @JoinTable()
  following: Artist[];
}
