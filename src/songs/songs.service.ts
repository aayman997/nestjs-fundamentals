import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongsDto } from './dto/create-songs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async create(songDTO: CreateSongsDto): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.artists = songDTO.artists;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    return this.songsRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  async update(
    id: number,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    if (Object.keys(recordToUpdate).length === 0) {
      throw new HttpException(
        'No fields to update were provided.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.songsRepository.update({ id }, { ...recordToUpdate });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.songsRepository.delete({ id });
  }
}
