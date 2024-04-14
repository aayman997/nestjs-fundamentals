import { Controller, Get, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Artist } from './artists.entity';

@Controller('artists')
@ApiTags('Artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find the artist with a given id' })
  @ApiResponse({ status: 200, description: 'It will return the artist matching the given id in the response' })
  findArtists(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<Artist> {
    return this.artistsService.findArtist(id);
  }
}
