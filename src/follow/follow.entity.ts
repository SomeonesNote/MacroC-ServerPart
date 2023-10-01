import { Artist } from 'src/artist/artist.entity';
import { User } from 'src/auth/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => Artist, (artist) => artist.followers)
  @JoinColumn({ name: 'artistId' })
  artist: Artist;
}
