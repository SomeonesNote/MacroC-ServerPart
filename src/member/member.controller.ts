import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDto } from './dto/memberDto';
import { GetArtist } from 'src/artist/get-artist.decorator';
import { Artist } from 'src/artist/artist.entity';
import { Member } from './member.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('member')
@UseGuards(AuthGuard())
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
