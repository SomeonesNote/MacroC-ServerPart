import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './artist.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { UploadImageServce } from 'src/upload/uploadImage.service';
import { UploadPath } from 'src/upload/uploadPath';

@Controller('artist')
export class ArtistController {
  constructor(
    private artistService: ArtistService,
    private readonly uploadImageServce: UploadImageServce,
  ) {}

  @Get('/All')
  getAllArtists(): Promise<Artist[]> {
    return this.artistService.getAllArtiists();
  }

  @Get('/:id')
  getArtistById(@Param('id') id: number): Promise<Artist> {
    return this.artistService.getArtistById(id);
  }

  @Delete('/:id')
  deleteArtsist(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.artistService.deleteArtist(id);
  }

  @Patch('/update/:id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async createArtist(
    @Param('id', ParseIntPipe) id: number,
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

    const updatedArtist = await this.artistService.updateUser(
      id,
      user,
      createArtistDto,
    );
    return updatedArtist;
  }
}
