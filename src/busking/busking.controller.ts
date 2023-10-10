import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  //   UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { BuskingService } from './busking.service';
import { Busking } from './busking.entity';
import { BuskingDto } from './dto/buskingDto';
import { GetArtist } from 'src/artist/get-artist.decorator';
import { Artist } from 'src/artist/artist.entity';

@Controller('busking')
export class BuskingController {
  private logger = new Logger('BuskingController');
  constructor(private buskingService: BuskingService) {}

  @Post('/register/:artistId')
  @UsePipes(ValidationPipe)
  createBusking(
    @Body() buskingDto: BuskingDto,
    @Param('artistId') artistId: number,
    // @GetArtist() artist: Artist,
  ): Promise<Busking> {
    this.logger.verbose(
      `Busking Performance is being created by Artist : ${artistId}. Data: ${JSON.stringify(
        buskingDto,
      )}`,
    );
    const artist = new Artist();
    artist.id = artistId;

    return this.buskingService.createBusking(buskingDto, artistId);
  }

  @Get('/getAll')
  getAllBusking(@GetArtist() artist: Artist): Promise<Busking[]> {
    this.logger.verbose(
      `Busking Performance is being fetched by Artist : ${artist.stageName}`,
    );
    console.log(artist);
    return this.buskingService.getAllBusking(artist);
  }

  @Get('/:id')
  getBuskingById(@Param('id') id: number): Promise<Busking> {
    return this.buskingService.getBuskingById(id);
  }

  @Delete('/:id')
  deleteBusking(
    @Param('id', ParseIntPipe) id: number,
    @GetArtist() artist: Artist,
  ): Promise<void> {
    return this.buskingService.deleteBuskingById(id, artist);
  }
}
