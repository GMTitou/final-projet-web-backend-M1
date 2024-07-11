import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqService } from './rabbitmq.service';

describe('RabbitmqController', () => {
  let controller: RabbitmqController;
  let service: RabbitmqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RabbitmqController],
      providers: [
        {
          provide: RabbitmqService,
          useValue: {
            getMessages: jest.fn(),
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RabbitmqController>(RabbitmqController);
    service = module.get<RabbitmqService>(RabbitmqService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return messages for a user', async () => {
    const result = [
      {
        id: 1,
        content: 'Test message',
        senderId: '1',
        recipientId: '2',
        conversationId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    jest.spyOn(service, 'getMessages').mockResolvedValue(result);

    expect(await controller.getMessages('1')).toBe(result);
  });

  it('should send a message', async () => {
    const message = {
      id: 1,
      content: 'Test message',
      senderId: '1',
      recipientId: '2',
      conversationId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(service, 'sendMessage').mockResolvedValue(message);

    const body = { content: 'Hello', senderId: '1', recipientId: '2' };
    expect(await controller.sendMessage(body)).toBe(message);
  });
});
