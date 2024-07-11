import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
  let service: ConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionService],
    }).compile();

    service = module.get<ConnectionService>(ConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a connected user', () => {
    const user = { userId: '123' };
    service.addConnectedUser(user);
    expect(service.getConnectedUsers()).toContain(user);
  });

  it('should remove a connected user', () => {
    const user1 = { userId: '123' };
    const user2 = { userId: '456' };
    service.addConnectedUser(user1);
    service.addConnectedUser(user2);
    service.removeConnectedUser(user1);
    expect(service.getConnectedUsers()).not.toContain(user1);
    expect(service.getConnectedUsers()).toContain(user2);
  });

  it('should return all connected users', () => {
    const user1 = { userId: '123' };
    const user2 = { userId: '456' };
    service.addConnectedUser(user1);
    service.addConnectedUser(user2);
    expect(service.getConnectedUsers()).toEqual([user1, user2]);
  });
});
