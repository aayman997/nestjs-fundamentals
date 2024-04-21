import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult, In } from 'typeorm';
import { Song } from './songs.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Artist } from '../artists/artists.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async create(songDTO: CreateSongDto): Promise<Song> {
    const song = new Song();
    song.title = songDTO.title;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;
    song.releasedDate = songDTO.releasedDate;

    // find all the artists on the based ids
    song.artists = await this.artistsRepository.findBy({
      id: In(songDTO.artists),
    });

    return this.songsRepository.save(song);
  }

  async findAll(): Promise<Song[]> {
    return this.songsRepository.find();
  }

  async findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
    const { artists: _artists, ...modifiedRecord } = recordToUpdate;
    if (Object.keys(recordToUpdate).length === 0) {
      throw new HttpException('No fields to update were provided.', HttpStatus.BAD_REQUEST);
    }
    let artists: Artist[];
    if (recordToUpdate.artists.length) {
      artists = await this.artistsRepository.findBy({
        id: In(recordToUpdate.artists),
      });
    }
    return this.songsRepository.update({ id }, { ...modifiedRecord, ...(recordToUpdate.artists.length && { artists }) });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.songsRepository.delete({ id });
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
