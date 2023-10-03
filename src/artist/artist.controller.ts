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

@Controller('artist')
@UseGuards(AuthGuard())
export class ArtistController {
  private logger = new Logger('ArtistController');
  constructor(private artistService: ArtistService) {}

  @Post('/create-artist')
  @UsePipes(ValidationPipe)
  async createArtist(
    @Body() createArtistDto: CreateArtistDto, // 클라이언트에서 받은 아티스트 정보 DTO
    @GetUser() user: User, // 현재 로그인한 사용자 정보
  ): Promise<Artist> {
    this.logger.verbose(
      `User ${user.username} creating a new board. Payload: ${JSON.stringify(
        createArtistDto,
      )}`,
    );
    return this.artistService.createArtist(user, createArtistDto);
  }
}
