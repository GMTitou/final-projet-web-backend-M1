import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsController } from './connection.controller';
import { ConnectionService } from './connection.service';

describe('ConnectionsController', () => {
  let controller: ConnectionsController;
  let service: ConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionsController],
      providers: [
        {
          provide: ConnectionService,
          useValue: {
            getConnectedUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConnectionsController>(ConnectionsController);
    service = module.get<ConnectionService>(ConnectionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return connected users', () => {
    const result = [{ userId: '123' }];
    jest.spyOn(service, 'getConnectedUsers').mockReturnValue(result);

    expect(controller.getConnectedUsers()).toBe(result);
  });
});
