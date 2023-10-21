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
    return await this.memberRepository.createMember(memberDto, artist);
  }

  async getArtistMembers(artistId: number): Promise<Member[]> {
    const query = this.memberRepository.createQueryBuilder('member');
    query.where('member.artistId = :artistId', { artistId });
    const members = await query.getMany();
    return members;
  }

  async deleteMemeber(id: number): Promise<void> {
    const artist = await this.artistRepository.findOneBy({
      members: { id },
    });
    console.log(artist);
    const result = await this.memberRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Memeber with ID "${id}" not found`);
    }
  }
}
