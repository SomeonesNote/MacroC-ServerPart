import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './artist.entity';
// import { GetUser } from 'src/auth/get-user.decorator';
// import { User } from 'src/auth/user.entity';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

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
}
