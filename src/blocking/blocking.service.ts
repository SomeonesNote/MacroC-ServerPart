import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/auth/user.repository';

interface IBlockingDto {
  userId: number;
  artistId: number;
}

@Injectable()
export class BlockingService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
  ) {}

  async blocking({ userId, artistId }: IBlockingDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['blockedUsers'],
    });

    if (!userId || !artistId) {
      throw new Error('userId and artistId must be provided');
    }

    if (!user) {
      throw new Error('User not found');
    } else if (!artist) {
      throw new Error('Artist not found');
    }

    user.blockedArtists.push(artist);
    await this.userRepository.save(user);

    artist.blockedUsers.push(user);
    await this.artistRepository.save(artist);
  }
}
