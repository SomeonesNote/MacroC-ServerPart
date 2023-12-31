import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
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
import { UploadImageService } from 'src/upload/uploadImage.service';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('member')
@UseGuards(AuthGuard('jwt'))
export class MemberController {
  constructor(
    private memberService: MemberService,
    private readonly uploadImageService: UploadImageService,
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
        const key = await this.uploadImageService.upload(
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
    @GetUser() user: User,
  ): Promise<Member[]> {
    return await this.memberService.getAllArtistMembers(artistId, user.id);
  }

  @Get('/:id')
  getArtistMemberById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Member> {
    return this.memberService.getArtistMemberById(id, user.id);
  }

  @Delete('/:id')
  deleteMember(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.memberService.deleteMemeber(id);
  }

  @Delete('/:artistId')
  deleteAllMember(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<void> {
    return this.memberService.deleteAllMemers(artistId);
  }

  @Patch('/update/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async updateMember(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
      }),
    )
    images,
    @Param('artistId') artistId: number,
    @Body() memberDto: MemberDto,
  ): Promise<Member> {
    let imgUrl = '';
    const memberName = memberDto.memberName;
    const artist = new Artist();
    artist.id = artistId;

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.uploadImageService.upload(
          UploadPath.membersImages,
          memberName,
          image,
          artistId,
        );
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${UploadPath.membersImages}/${artistId}/${memberName}/${key}`;
      }),
    );
    memberDto.memberImage = imgUrl;

    const updatedMember = await this.memberService.updateMember(
      id,
      artistId,
      memberDto,
    );
    return updatedMember;
  }
}
