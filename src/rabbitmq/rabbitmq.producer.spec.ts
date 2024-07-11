import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqProducer } from './rabbitmq.producer';
import { ConnectionService } from './connection/connection.service';
import { UserService } from '../user/user.service';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

describe('RabbitmqProducer', () => {
  let producer: RabbitmqProducer;
  let connectionService: ConnectionService;
  let userService: UserService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitmqProducer,
        {
          provide: ConnectionService,
          useValue: {
            addConnectedUser: jest.fn(),
            removeConnectedUser: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
        {
          provide: ClientProxy,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                RABBITMQ_USER: 'user',
                RABBITMQ_PASS: 'pass',
                RABBITMQ_HOST: 'localhost',
              };
              return config[key];
            }),
          },
        },
        {
          provide: 'CHAT_SERVICE', // Fournir un mock pour CHAT_SERVICE
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    producer = module.get<RabbitmqProducer>(RabbitmqProducer);
    connectionService = module.get<ConnectionService>(ConnectionService);
    userService = module.get<UserService>(UserService);
    client = module.get<ClientProxy>(ClientProxy);
  });

  it('should be defined', () => {
    expect(producer).toBeDefined();
  });

  it('should add a connected user', async () => {
    const user = {
      id: '1',
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@example.com', // Propriété ajoutée
      password: 'password123', // Propriété ajoutée
    };
    jest.spyOn(userService, 'findUserById').mockResolvedValue(user);

    const emitSpy = jest.spyOn(client, 'emit'); // Utilisez jest.spyOn pour espionner l'appel

    await producer.userConnected('1');

    console.log('Calls to client.emit:', emitSpy.mock.calls); // Utiliser emitSpy.mock.calls

    expect(emitSpy).toHaveBeenCalledWith('user_connected', { userId: '1' });
    expect(connectionService.addConnectedUser).toHaveBeenCalledWith({
      userId: '1',
      nom: 'Doe',
      prenom: 'John',
    });
  });

  it('should remove a connected user', async () => {
    const user = {
      id: '1',
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@example.com', // Propriété ajoutée
      password: 'password123', // Propriété ajoutée
    };
    jest.spyOn(userService, 'findUserById').mockResolvedValue(user);

    const emitSpy = jest.spyOn(client, 'emit'); // Utilisez jest.spyOn pour espionner l'appel

    await producer.userDisconnected('1');

    console.log('Calls to client.emit:', emitSpy.mock.calls); // Utiliser emitSpy.mock.calls

    expect(emitSpy).toHaveBeenCalledWith('user_disconnected', { userId: '1' });
    expect(connectionService.removeConnectedUser).toHaveBeenCalledWith({
      userId: '1',
      nom: 'Doe',
      prenom: 'John',
    });
  });
});
