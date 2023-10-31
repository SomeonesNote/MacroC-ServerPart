import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistRepository } from './artist.repository';
import { User } from 'src/auth/user.entity';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { Artist } from './artist.entity';
import { UserRepository } from 'src/auth/user.repository';
import { UserFollowingService } from 'src/follow/user-following.service';

@Injectable()
export class ArtistService {
  constructor(
    private userFollowingService: UserFollowingService,
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createArtist(
    user: User,
    createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistRepository.createArtist(createArtistDto, user);
  }

  async getAllArtiists(userId: number): Promise<Artist[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });

    const blockedArtisIds = user.blockedArtists.map((artist) => artist.id);
    const artists = this.artistRepository.find();
    return (await artists).filter(
      (artist) => !blockedArtisIds.includes(artist.id),
    );
  }

  async getArtistById(artistId: number, userId?: number): Promise<Artist> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });

    const found = await this.artistRepository.findOneBy({ id: artistId });
    const blockedArtistIds = user.blockedArtists.map((artist) => artist.id);

    if (!blockedArtistIds.includes(artistId)) {
      console.log(`${user.id}는 ${found.stageName}를 차단했습니다.`);
      throw new NotFoundException(
        `요청하신 ${found.stageName}를 찾을 수 없습니다.`,
      );
    } else {
      if (!found) {
        throw new NotFoundException(
          `요청하신 ${found.stageName}를 찾을 수가 없습니다.`,
        );
      }
      return found;
    }
  }

  async deleteArtist(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { artist: { id } },
      relations: ['following'],
    });

    const artist = await this.artistRepository.findOne({
      where: { id: id },
      relations: ['followers'],
    });

    artist.followers
      .filter((user) => user.id !== null)
      .map((user) =>
        this.userFollowingService.unfollowArtist(user.id, artist.id),
      );

    user.artist = null;
    artist.followers = artist.followers.filter((user) => user.id === null);
    artist.members = null;
    artist.buskings = null;

    await this.userRepository.save(user);
    await this.artistRepository.save(artist);

    const result = await this.artistRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }
  }

  async updateArtist(
    id: number,
    user: User,
    createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    const artist = await this.getArtistById(id);

    artist.stageName = createArtistDto.stageName;
    artist.artistImage = createArtistDto.artistImage;
    artist.artistInfo = createArtistDto.artistInfo;
    artist.genres = createArtistDto.genres;
    artist.instagramURL = createArtistDto.instagramURL;
    artist.youtubeURL = createArtistDto.youtubeURL;
    artist.soundcloudURL = createArtistDto.soundcloudURL;
    artist.user = user;

    await this.artistRepository.save(artist);
    return artist;
  }
}
