import { Artist } from 'src/artist/artist.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class UserArtistRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following)
  follower: User;

  @ManyToOne(() => Artist, (artist) => artist.followers)
  artist: Artist;
}
