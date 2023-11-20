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
      relations: ['following', 'blockedArtists'],
    });
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
      relations: ['followers'],
    });

    const followingIds = user.following.map((artist) => artist.id);
    const blockedArtisIds = user.blockedArtists.map((artist) => artist.id);

    if (!user) {
      throw new Error('User not found');
    } else if (!artist) {
      throw new Error('Artist not found');
    }

    if (!blockedArtisIds.includes(artist.id)) {
      if (!followingIds.includes(artist.id)) {
        user.following.push(artist);
        await this.userRepository.save(user);
        artist.followers.push(user);
        await this.artistRepository.save(artist);
      } else {
        throw new NotFoundException(
          `요청하신 ${artist.id}는 이미 팔로우 중입니다.`,
        );
      }
    } else {
      throw new NotFoundException(
        `요청하신 ${artist.stageName}를 찾을 수 없습니다.`,
      );
    }
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
      relations: ['followers', 'blockedUsers'],
    });
    const blokckedUserIds = artist.blockedUsers.map((user) => user.id);
    const followingUserIds = artist.followers.map((user) => user.id);
    const returnUserIds = followingUserIds.filter(
      (userId) => !blokckedUserIds.includes(userId),
    );

    if (!artist) {
      throw new NotFoundException(`${artist.stageName}을 찾을 수 없습니다.`);
    }
    return artist.followers.filter((user) => returnUserIds.includes(user.id));
  }

  async getFollowingOfUser(userId: number): Promise<Artist[]> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following', 'blockedArtists'],
    });
    const blockedArtistIds = user.blockedArtists.map((artist) => artist.id);
    const followArtistIds = user.following
      .map((artist) => artist.id)
      .filter((artistId) => !blockedArtistIds.includes(artistId));

    const returnArtist = user.following.filter((artist) =>
      followArtistIds.includes(artist.id),
    );

    if (!user) {
      throw new NotFoundException(`${user.username}를 찾을 수 없습니다.`);
    }

    returnArtist.forEach((artist) => {
      artist.buskings = artist.buskings.filter(
        (busking) => busking.BuskingEndTime > currentTime,
      );
    });
    return returnArtist;
  }
}
