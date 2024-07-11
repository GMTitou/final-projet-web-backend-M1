import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RabbitmqProducer } from './rabbitmq.producer';

describe('RabbitmqService', () => {
  let service: RabbitmqService;
  let prisma: PrismaService;
  let producer: RabbitmqProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqService,
        {
          provide: PrismaService,
          useValue: {
            message: { findMany: jest.fn(), create: jest.fn() },
            conversation: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: RabbitmqProducer,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RabbitmqService>(RabbitmqService);
    prisma = module.get<PrismaService>(PrismaService);
    producer = module.get<RabbitmqProducer>(RabbitmqProducer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    jest.spyOn(prisma.message, 'findMany').mockResolvedValue(result);

    expect(await service.getMessages('1')).toBe(result);
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
    jest.spyOn(prisma.message, 'create').mockResolvedValue(message);

    const conversation = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(prisma.conversation, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.conversation, 'create').mockResolvedValue(conversation);

    const result = await service.sendMessage('Hello', '1', '2');
    expect(result).toBe(message);
    expect(producer.sendMessage).toHaveBeenCalledWith(message);
  });
});
