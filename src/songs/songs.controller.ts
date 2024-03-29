import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Inject,
  Scope,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongsDto } from './dto/create-songs.dto';
import { Connection } from '../common/constants/connection';

@Controller({ path: 'songs', scope: Scope.REQUEST })
export class SongsController {
  constructor(
    private songsService: SongsService,
    @Inject('CONNECTION') private connection: Connection,
  ) {
    console.log('this.connection', this.connection);
  }

  @Post()
  create(@Body() createSong: CreateSongsDto) {
    console.log('this.songsService', this.songsService);
    return this.songsService.create(createSong);
  }

  @Get()
  findAll() {
    try {
      return this.songsService.findAll();
    } catch (e) {
      throw new HttpException(
        'In the catch block',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return `find song on the based id: ${typeof id}`;
  }

  @Put(':id')
  update() {
    return 'update song on the based id';
  }

  @Delete(':id')
  delete() {
    return 'delete song on the based id';
  }
}
