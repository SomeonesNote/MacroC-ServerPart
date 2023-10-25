import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from './member.repository';
import { MemberDto } from './dto/memberDto';
import { Member } from './member.entity';
import { ArtistRepository } from 'src/artist/artist.repository';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
    private artistRepository: ArtistRepository,
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

  async getArtistMemberById(id: number): Promise<Member> {
    const found = await this.memberRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    return found;
  }

  async getAllArtistMembers(artistId: number): Promise<Member[]> {
    const query = this.memberRepository.createQueryBuilder('member');
    query.where('member.artistId = :artistId', { artistId });
    const members = await query.getMany();
    return members;
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
