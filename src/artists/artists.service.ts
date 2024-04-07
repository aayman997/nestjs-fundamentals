import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from './artists.entity';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
  ) {}

  findArtist(userId: number): Promise<Artist> {
    return this.artistRepo.findOneBy({ user: { id: userId } });
  }

  async createArtist(userId: number): Promise<Artist> {
    const isArtist = await this.findArtist(userId);
    if (isArtist) {
      throw new ConflictException('Artist already exists');
    }
    const user = new User();
    user.id = userId;

    const artist = new Artist();
    artist.user = user;

    return this.artistRepo.save(artist);
  }

  async deleteArtist(userId: number): Promise<DeleteResult> {
    const isArtist = await this.findArtist(userId);
    if (!isArtist) {
      throw new ConflictException('No Artist to delete');
    }
    return this.artistRepo.delete({ user: { id: userId } });
  }
}
