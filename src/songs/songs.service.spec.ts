import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { Repository } from 'typeorm';
import { Song } from './songs.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { Artist } from '../artists/artists.entity';

describe('SongsService', () => {
  let service: SongsService;
  let repo: Repository<Song>;
  const oneSong = { id: 1, title: 'test song' };
  const artists = [
    { id: 1, name: 'Artist 1' },
    { id: 2, name: 'Artist 2' },
  ];
  const songArray = [oneSong];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findBy: jest.fn().mockImplementation((id: number[]) => {
              return Promise.resolve(artists);
            }),
          },
        },
        {
          provide: getRepositoryToken(Song),
          useValue: {
            create: jest.fn().mockImplementation((createSongDTO: CreateSongDto) => {
              return Promise.resolve({ ...createSongDTO, artists, id: 'a uuid' });
            }),
            save: jest.fn().mockImplementation((createSongDTO: CreateSongDto) => {
              return Promise.resolve({ ...createSongDTO, artists, id: 'a uuid' });
            }),
            find: jest.fn().mockImplementation(() => Promise.resolve(songArray)),
            findOneOrFail: jest.fn().mockImplementation(() => {
              return Promise.resolve(oneSong);
            }),
            update: jest.fn().mockImplementation(() => {
              return Promise.resolve({ affected: 1 });
            }),
            delete: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
          },
        },
      ],
    }).compile();

    service = await module.resolve<SongsService>(SongsService);
    repo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new song with the provided data', async () => {
    const songDTO: CreateSongDto = {
      artists: [1, 2],
      releasedDate: new Date('12-04-2020'),
      title: 'New song',
      lyrics: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sed lacinia nunc, quis rutrum felis. Sed laoreet
      aliquet nisl, id sollicitudin ante tincidunt ac. Mauris tincidunt enim ut finibus blandit.`,
      duration: '02:30',
    };

    const song = await service.create(songDTO);
    const repoSpySave = jest.spyOn(repo, 'save');
    expect(song).toEqual({ ...songDTO, artists, id: 'a uuid' });
    expect(repoSpySave).toHaveBeenCalled();
  });

  it('should give me the song by id', async () => {
    const song = await service.findOne(1);
    const repoSpy = jest.spyOn(repo, 'findOneOrFail');
    expect(song).toEqual(oneSong);
    expect(repoSpy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should give me a list of songs', async () => {
    const song = await service.findAll();
    const repoSpy = jest.spyOn(repo, 'find');
    expect(song).toEqual(songArray);
    expect(repoSpy).toHaveBeenCalled();
  });

  it('should delete a song with the provided Id', async () => {
    const song = await service.delete(1);
    const repoSpy = jest.spyOn(repo, 'delete');
    expect(song).toEqual({ affected: 1 });
    expect(repoSpy).toHaveBeenCalled();
  });
});
