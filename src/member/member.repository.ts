import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MemberDto } from 'src/member/dto/memberDto';
import { Member } from 'src/member/member.entity';
import { DataSource, Repository } from 'typeorm';
// import { Artist } from '../artist/artist.entity';

@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(dataSource: DataSource) {
    super(Member, dataSource.createEntityManager());
  }

  // async createMember(memberDto: MemberDto, artist: Artist): Promise<Member> {
  async createMember(memberDto: MemberDto): Promise<Member> {
    const { memberName, memberDescription, artist } = memberDto;

    const member = this.create({
      memberName,
      memberDescription,
      artist,
    });

    try {
      await this.save(member);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `memberName : '${memberName}' already exists`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
    return member;
  }
}