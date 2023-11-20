import { Injectable, NotFoundException } from '@nestjs/common';
import { BuskingRepository } from './busking.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BuskingDto } from './dto/buskingDto';
import { Busking } from './busking.entity';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/auth/user.repository';
import { In, LessThanOrEqual, MoreThan, Not } from 'typeorm';
import { Artist } from 'src/artist/artist.entity';

@Injectable()
export class BuskingService {
  constructor(
    @InjectRepository(BuskingRepository)
    private buskingRepository: BuskingRepository,
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createBusking(
    buskingDto: BuskingDto,
    artistId: number,
  ): Promise<Busking> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    buskingDto.stageName = artist.stageName;
    buskingDto.artistImage = artist.artistImage;
    return await this.buskingRepository.createBusking(buskingDto, artist);
  }

  async getNowPlayingBuskings(userId: number): Promise<Busking[]> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });

    const blockedBuskingsIds = user.blockedArtists
      .flatMap((artist) => artist.buskings)
      .map((busking) => busking.id);

    const nowPlayingBuskings = await this.buskingRepository.find({
      where: {
        BuskingStartTime: LessThanOrEqual(currentTime),
        BuskingEndTime: MoreThan(currentTime),
        id: Not(In(blockedBuskingsIds)),
      },
    });

    return nowPlayingBuskings;
  }

  async getAllBuskingByArtist(
    artistId: number,
    userId?: number,
  ): Promise<Busking[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });
    const blockedArtisIds = user.blockedArtists.map((artist) => artist.id);

    if (!blockedArtisIds.includes(Number(artistId))) {
      const query = this.buskingRepository.createQueryBuilder('busking');
      query.where('busking.artistId = :artistId', { artistId });
      const buskings = await query.getMany();
      return buskings;
    } else {
      throw new NotFoundException(`요청하신 버스킹 정보를 찾을 수 없습니다.`);
    }
  }

  async getArtistByBuskingId(
    buskingId: number,
    userId?: number,
  ): Promise<Artist> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });
    const busking = await this.buskingRepository.findOne({
      where: { id: buskingId },
      relations: ['artist'],
    });
    const blockedBuskingsIds = user.blockedArtists
      .flatMap((artist) => artist.buskings)
      .map((busking) => busking.id);

    if (blockedBuskingsIds.includes(buskingId)) {
      throw new NotFoundException(`요청하신 버스킹 정보를 찾을 수 없습니다.`);
    } else {
      if (!busking) {
        throw new NotFoundException(`요청하신 버스킹을 찾을 수 없습니다.`);
      }
      return busking.artist;
    }
  }

  async getBuskingById(id: number, userId?: number): Promise<Busking> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });
    const found = await this.buskingRepository.findOneBy({ id });
    const blockedArtisBuskings = user.blockedArtists.flatMap(
      (artist) => artist.buskings,
    );
    const blockedBuskingsIds = blockedArtisBuskings.map(
      (busking) => busking.id,
    );
    if (blockedBuskingsIds.includes(found.id)) {
      throw new NotFoundException(`요청하신 버스킹 정보를 찾을 수 없습니다.`);
    } else {
      if (!found) {
        throw new NotFoundException(`요청하신 버스킹 정보를 찾을 수 없습니다.`);
      }
      return found;
    }
  }

  async deleteBuskingById(id: number, artistId: number): Promise<void> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    const result = await this.buskingRepository.delete({
      id,
      artist: { id: artist.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`요청하신 버스킹 정보를 찾을 수 없습니다.`);
    }
  }

  async deleteAllBuskingByArtist(artistId: number): Promise<void> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    const buskings = await this.buskingRepository.findOne({
      where: { id: artistId },
    });
    const result = await this.buskingRepository.delete({
      artist: { id: artist.id },
    });

    if (!buskings) {
      return;
    }
    if (result.affected === 0) {
      throw new NotFoundException(`요청하신 버스킹 정보를 찾을 수 없습니다.`);
    }
  }

  async updateBusking(
    id: number,
    artistId: number,
    buskingDto: BuskingDto,
  ): Promise<Busking> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    const busking = await this.getBuskingById(id);

    busking.BuskingStartTime = buskingDto.BuskingStartTime;
    busking.BuskingEndTime = buskingDto.BuskingEndTime;
    busking.BuskingInfo = buskingDto.BuskingInfo;
    busking.latitude = buskingDto.latitude;
    busking.longitude = buskingDto.longitude;
    busking.artist = artist;

    await this.buskingRepository.save(busking);
    return busking;
  }
}
