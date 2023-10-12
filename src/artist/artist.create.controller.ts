import {
  Body,
  Controller,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Artist } from './artist.entity';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadImageServce } from 'src/upload/uploadImage.service';
import { UploadPath } from 'src/upload/uploadPath';

@Controller('artist-POST')
@UseGuards(AuthGuard())
export class ArtistCreateController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly uploadImageServce: UploadImageServce,
  ) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async createArtist(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
      }),
    )
    images,
    @Body() createArtistDto: CreateArtistDto,
    @GetUser() user: User,
  ): Promise<Artist> {
    let imgUrl: string = '';
    const stageName = createArtistDto.stageName;

    await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const key = await this.uploadImageServce.upload(
          UploadPath.artistImages,
          stageName,
          image,
        );
        imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${UploadPath.artistImages}/${stageName}/${key}`;
      }),
    );
    createArtistDto.artistImage = imgUrl;
    return await this.artistService.createArtist(user, createArtistDto);
  }
}
