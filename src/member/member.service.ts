import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from './member.repository';
import { MemberDto } from './dto/memberDto';
import { Member } from './member.entity';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
    private artistRepository: ArtistRepository,
    private userRepository: UserRepository,
  ) {}

  async createMember(artistId: number, memberDto: MemberDto): Promise<Member> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });

    if (artist === null) {
      throw new NotFoundException(`Artist "${artist}" not found`);
    }

    return await this.memberRepository.createMember(memberDto, artist);
  }

  async getAllArtistMembers(
    artistId: number,
    userId?: number,
  ): Promise<Member[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });
    const blockedArtisIds = user.blockedArtists.map((artist) => artist.id);

    if (!blockedArtisIds.includes(Number(artistId))) {
      const query = this.memberRepository.createQueryBuilder('member');
      query.where('member.artistId = :artistId', { artistId });
      const members = await query.getMany();
      return members;
    } else {
      throw new NotFoundException(`요청하신 멤버 정보를 찾을 수 없습니다.`);
    }
  }

  async getArtistMemberById(id: number, userId?: number): Promise<Member> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedArtists'],
    });
    const found = await this.memberRepository.findOneBy({ id });
    const blockedArtisMembers = user.blockedArtists.flatMap(
      (artist) => artist.members,
    );
    const blockedMembersIds = blockedArtisMembers.map((member) => member.id);

    if (blockedMembersIds.includes(found.id)) {
      throw new NotFoundException(`요청하신 멤버 정보를 찾을 수 없습니다.`);
    } else {
      if (!found) {
        throw new NotFoundException(`요청하신 멤버 정보를 찾을 수 없습니다.`);
      }
      return found;
    }
  }

  async deleteMemeber(id: number): Promise<void> {
    const result = await this.memberRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Memeber with ID "${id}" not found`);
    }
  }

  async updateMember(
    id: number,
    artistId: number,
    memberDto: MemberDto,
  ): Promise<Member> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    const member = await this.getArtistMemberById(id);

    member.memberName = memberDto.memberName;
    member.memberInfo = memberDto.memberInfo;
    member.memberImage = memberDto.memberImage;
    member.artist = artist;

    await this.memberRepository.save(member);
    return member;
  }
}
