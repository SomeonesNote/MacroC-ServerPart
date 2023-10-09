import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberRepository } from './member.repository';
import { Artist } from 'src/artist/artist.entity';
import { MemberDto } from './dto/memberDto';
import { Member } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberRepository)
    private memberRepository: MemberRepository,
  ) {}

  async createMember(artist: Artist, memberDto: MemberDto): Promise<Member> {
    return await this.memberRepository.createMember(memberDto);
  }

  async getArtistMembers(): Promise<Member[]> {
    // async getArtistMembers(artist: Artist): Promise<Member[]> {
    const query = this.memberRepository.createQueryBuilder('member');
    query.where('member.artistId = :artistId', { artistId: 11 });
    // query.where('member.artistId = :artistId', { artistId: 11 });

    const members = await query.getMany();
    return members;
  }
}
