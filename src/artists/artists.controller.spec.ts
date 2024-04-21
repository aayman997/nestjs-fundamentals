import { Test, TestingModule } from '@nestjs/testing';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';

describe('ArtistsController', () => {
  let controller: ArtistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        ArtistsService,
        {
          provide: ArtistsService,
          useValue: {
            findArtist: jest.fn().mockImplementation((_id: number) => {
              return Promise.resolve({ id: 2 });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return artist id based on the provided user id', async () => {
    const artist = await controller.findArtist(1);
    expect(artist).toEqual({ id: 2 });
  });
});
