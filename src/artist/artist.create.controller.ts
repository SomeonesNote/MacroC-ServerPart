import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/createArtistDto.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Artist } from './artist.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('artist-POST')
@UseGuards(AuthGuard())
export class ArtistCreateController {
  private logger = new Logger('ArtistCreateController');
  constructor(private artistService: ArtistService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  async createArtist(
    @Body() createArtistDto: CreateArtistDto,
    @GetUser() user: User,
  ): Promise<Artist> {
    this.logger.verbose(
      `User ${user.username} creating a new Artist. Payload: ${JSON.stringify(
        createArtistDto,
      )}`,
    );
    return await this.artistService.createArtist(user, createArtistDto);
  }
}
