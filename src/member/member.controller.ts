import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDto } from './dto/memberDto';
import { Artist } from 'src/artist/artist.entity';
import { Member } from './member.entity';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadPath } from 'src/upload/uploadPath';
import { UploadImageServce } from 'src/upload/uploadImage.service';

@Controller('member')
@UseGuards(AuthGuard())
export class MemberController {
  constructor(
    private memberService: MemberService,
    private readonly uploadImageServce: UploadImageServce,
  ) {}

  @Post('/create/:artistId')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async createMember(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
      }),
    )
    images,
    @Body() memberDto: MemberDto,
    @Param('artistId') artistId: number,
  ): Promise<Member> {
    let imgUrl = '';
    const memberName = memberDto.memberName;
    const artist = new Artist();
    artist.id = artistId;

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.uploadImageServce.upload(
          UploadPath.membersImages,
          memberName,
          image,
          artistId,
        );
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${UploadPath.membersImages}/${artistId}/${memberName}/${key}`;
      }),
    );
    memberDto.memberImage = imgUrl;
    return await this.memberService.createMember(artistId, memberDto);
  }

  @Get('/getAll/:artistId')
  async getArtistMembers(
    @Param('artistId') artistId: number,
  ): Promise<Member[]> {
    return await this.memberService.getArtistMembers(artistId);
  }

  @Delete('/:id')
  deleteMember(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.memberService.deleteMemeber(id);
  }
}
