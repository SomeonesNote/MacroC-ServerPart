import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDto } from './dto/memberDto';
import { GetArtist } from 'src/artist/get-artist.decorator';
import { Artist } from 'src/artist/artist.entity';
import { Member } from './member.entity';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  async createMember(
    @Body() memberDto: MemberDto,
    @GetArtist() artist: Artist,
  ) {
    return await this.memberService.createMember(artist, memberDto);
  }

  @Get('/get/:artistId')
  // async getArtistMembers(@GetArtist() artist: Artist): Promise<Member[]> {
  async getArtistMembers(): Promise<Member[]> {
    return await this.memberService.getArtistMembers();
    // return await this.memberService.getArtistMembers(artist);
  }
}
