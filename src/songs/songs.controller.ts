import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  HttpStatus,
  Param,
  ParseIntPipe,
  Scope,
  Query,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './songs.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistsJwtGuard } from '../auth/artists.jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller({ path: 'songs', scope: Scope.REQUEST })
@ApiTags('Songs')
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistsJwtGuard)
  @ApiOperation({ summary: 'Create a new song' })
  @ApiResponse({ status: 201, description: 'It will return the song in the response' })
  create(@Body() createSong: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSong);
  }

  @Get()
  @ApiOperation({ summary: 'Find all songs' })
  @ApiResponse({ status: 200, description: 'It will return all the songs paginated in the response' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a song' })
  @ApiResponse({ status: 200, description: 'It will return the song with the given id in the response' })
  findOne(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistsJwtGuard)
  @ApiOperation({ summary: 'Update a song', description: 'It will update the song with the given id' })
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, updateSongDTO);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(ArtistsJwtGuard)
  @ApiOperation({ summary: 'Delete a song', description: 'It will delete the song with the given id' })
  delete(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    id: number,
  ): Promise<DeleteResult> {
    return this.songsService.delete(id);
  }
}
