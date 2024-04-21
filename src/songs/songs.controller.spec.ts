import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        SongsService,
        {
          provide: SongsService,
          useValue: {
            create: jest.fn().mockImplementation((createSongDTO: CreateSongDto) => {
              const requiredProps = ['title', 'artists', 'duration', 'releasedDate'];
              const missingProps = requiredProps.filter((prop) => !createSongDTO[prop]);

              if (missingProps.length) {
                return Promise.reject(new Error(`Missing properties: ${missingProps.join(', ')}`));
              }

              return Promise.resolve({ id: 'a uuid', ...createSongDTO });
            }),
            findAll: jest.fn().mockResolvedValue({
              items: [{ id: 1, title: 'Dancing' }],
              meta: {
                itemCount: 10,
                totalItems: 100,
                itemsPerPage: 10,
                totalPages: 10,
                currentPage: 1,
              },
            }),
            findOne: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ id: id, title: 'Dancing' });
            }),
            update: jest.fn().mockImplementation((_id: string, _updateSongDTO: UpdateSongDto) => {
              return Promise.resolve({ affected: 1 });
            }),
            delete: jest.fn().mockImplementation((_id: string) => {
              return Promise.resolve({ affected: 1 });
            }),
            paginate: jest.fn().mockImplementation(({ page, limit }) => {
              return Promise.resolve({
                items: [{ id: 1, title: 'Dancing' }],
                meta: {
                  itemCount: limit,
                  totalItems: 100,
                  itemsPerPage: limit,
                  totalPages: 10,
                  currentPage: page,
                },
              });
            }),
          },
        },
      ],
    }).compile();

    controller = await module.resolve<SongsController>(SongsController);
    service = await module.resolve<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new song with full data', async () => {
    const newSongDTO: CreateSongDto = {
      title: 'Runaway',
      artists: [1],
      duration: new Date('02:33'),
      lyrics: 'Runaway awesome lyrics',
      releasedDate: new Date('12-10-2023'),
    };
    const song = await controller.create(newSongDTO);
    expect(song).toEqual({
      id: 'a uuid',
      ...newSongDTO,
    });
    expect(service.create).toHaveBeenCalledWith(newSongDTO);
  });

  it('should create a new song with multiple artists', async () => {
    const newSongDTO: CreateSongDto = {
      title: 'Runaway',
      artists: [1, 2, 3],
      duration: new Date('02:33'),
      lyrics: 'Runaway awesome lyrics',
      releasedDate: new Date('12-10-2023'),
    };
    const song = await controller.create(newSongDTO);
    expect(song).toEqual({
      id: 'a uuid',
      ...newSongDTO,
    });
    expect(service.create).toHaveBeenCalledWith(newSongDTO);
  });

  it('should fetch all the songs', async () => {
    const songs = await controller.findAll();
    expect(songs).toEqual({
      items: [{ id: 1, title: 'Dancing' }],
      meta: {
        itemCount: 10,
        totalItems: 100,
        itemsPerPage: 10,
        totalPages: 10,
        currentPage: 1,
      },
    });
    expect(service.paginate).toHaveBeenCalled();
  });

  it('should fetch song based on thr provided id', async () => {
    const song = await controller.findOne(1);
    expect(song).toEqual({ id: 1, title: 'Dancing' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update song data', async () => {
    const updateSongDto: UpdateSongDto = {
      title: 'Animals',
    };
    const song = await controller.update(1, updateSongDto);
    expect(song).toEqual({ affected: 1 });
    expect(service.update).toHaveBeenCalledWith(1, updateSongDto);
  });

  it('should delete the song with provided id', async () => {
    const song = await controller.delete(1);
    expect(song).toEqual({ affected: 1 });
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
