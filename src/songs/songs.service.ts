import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class SongsService {
  //   Local db
  //   Local array
  private readonly songs = [];

  create(song) {
    // Save the song in the db
    this.songs.push(song);
    return this.songs;
  }

  findAll() {
    // Fetch the songs from the db
    // Error comes while fetching the data from db
    return this.songs;
  }
}
