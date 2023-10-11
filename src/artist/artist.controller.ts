import { Controller, Get, Param } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './artist.entity';

@Controller('artist-GET')
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
}
