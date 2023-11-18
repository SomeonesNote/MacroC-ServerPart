import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BuskingService } from './busking.service';
import { Busking } from './busking.entity';
import { BuskingDto } from './dto/buskingDto';
import { Artist } from 'src/artist/artist.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('busking')
@UseGuards(AuthGuard('jwt'))
export class BuskingController {
  private logger = new Logger('BuskingController');
  constructor(private buskingService: BuskingService) {}

  @Post('/register/:artistId')
  @UsePipes(ValidationPipe)
  async createBusking(
    @Body() buskingDto: BuskingDto,
    @Param('artistId') artistId: number,
  ): Promise<Busking> {
    this.logger.verbose(
      `Busking Performance is being created by Artist : ${artistId}. Data: ${JSON.stringify(
        buskingDto,
      )}`,
    );
    const artist = new Artist();
    artist.id = artistId;
    return await this.buskingService.createBusking(buskingDto, artistId);
  }

  @Get('/getNowPlayingBuskings')
  async getNowPlayingBusking(@GetUser() user: User): Promise<Busking[]> {
    return await this.buskingService.getNowPlayingBuskings(user.id);
  }

  @Get('/getAllBuskings')
  async getAllBuskings(@GetUser() user: User): Promise<Busking[]> {
    return await this.buskingService.getAllBuskings(user.id);
  }

  @Get('/getAll/:artistId')
  async getAllBuskingByArtist(
    @Param('artistId') artistId: number,
    @GetUser() user: User,
  ): Promise<Busking[]> {
    this.logger.verbose(
      `Busking Performance is being fetched by Artist : ${artistId}, User : ${user.id}`,
    );
    return await this.buskingService.getAllBuskingByArtist(artistId, user.id);
  }

  @Get('/:id')
  getBuskingById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<Busking> {
    return this.buskingService.getBuskingById(id, user.id);
  }

  @Delete('/:artistId/:id')
  deleteBusking(
    @Param('id', ParseIntPipe) id: number,
    @Param('artistId') artistId: number,
  ): Promise<void> {
    return this.buskingService.deleteBuskingById(id, artistId);
  }

  @Delete('/:artistId')
  deleteAllBusking(
    @Param('artistId', ParseIntPipe) artistId: number,
  ): Promise<void> {
    return this.buskingService.deleteAllBuskingByArtist(artistId);
  }

  @Patch('update/:id')
  async updateBusking(
    @Param('id') id: number,
    @Param('artistId') artistId: number,
    @Body() buskingDto: BuskingDto,
  ): Promise<Busking> {
    const updatedBusking = await this.buskingService.updateBusking(
      id,
      artistId,
      buskingDto,
    );
    return updatedBusking;
  }
}
