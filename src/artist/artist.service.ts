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
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private userFollowingService: UserFollowingService,
  ) {}

  async createArtist(
    user: User,
    createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistRepository.createArtist(createArtistDto, user);
  }

  async getAllArtiists(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async getArtistById(id: number): Promise<Artist> {
    const found = await this.artistRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Artist with ID "${id}" not found`);
    }
    return found;
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

  async updateUser(
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
