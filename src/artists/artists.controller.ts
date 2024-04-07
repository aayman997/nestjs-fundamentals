import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get(':id')
  findArtists(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.artistsService.findArtist(id);
  }
}
