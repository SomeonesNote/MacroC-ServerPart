import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/artist/artist.entity';
import { ArtistRepository } from 'src/artist/artist.repository';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class UserFollowingService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
  ) {}

  async followArtist(userId: number, artistId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['followers'],
    });

    if (!user) {
      throw new Error('User not found');
    } else if (!artist) {
      throw new Error('Artist not found');
    }

    user.following.push(artist);
    await this.userRepository.save(user);

    artist.followers.push(user);
    await this.artistRepository.save(artist);
  }

  async unfollowArtist(userId: number, artistId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['followers'],
    });

    if (!user || !artist) {
      throw new NotFoundException('User not found');
    }

    // const isFollowing = user.following.some((artist) => artist.id === artistId);
    // const isFollowers = artist.followers.some((user) => user.id === userId);

    user.following = user.following.filter(
      (artist) => artist.id !== Number(artistId),
    );
    await this.userRepository.save(user);

    artist.followers = artist.followers.filter(
      (user) => user.id !== Number(userId),
    );
    await this.artistRepository.save(artist);
  }

  async getFollowersOfArtist(artistId: number): Promise<User[]> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['followers'],
    });

    if (!artist) {
      throw new NotFoundException(`Artist with ID "${artistId}" not found`);
    }

    return artist.followers;
  }

  async getFollowersOfUser(userId: number): Promise<Artist[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return user.following;
  }
}
