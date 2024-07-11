import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RabbitmqProducer } from 'src/rabbitmq/rabbitmq.producer';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let userService: UserService;
  let jwtService: JwtService;
  let rabbitmqProducer: RabbitmqProducer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            generateUniqueId: jest.fn(),
            isValidEmail: jest.fn(),
            isValidPassword: jest.fn(),
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RabbitmqProducer,
          useValue: {
            userConnected: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    rabbitmqProducer = module.get<RabbitmqProducer>(RabbitmqProducer);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const body = {
        email: 'test@example.com',
        password: 'Password123!',
        lastName: 'Doe',
        firstName: 'John',
      };
      const hashedPassword = 'hashedPassword';
      const user = {
        id: '123456',
        email: body.email,
        password: hashedPassword,
        lastName: body.lastName,
        firstName: body.firstName,
      } as User;
      const token = { access_token: 'jwtToken' }; // Adjusted type

      jest.spyOn(userService, 'generateUniqueId').mockReturnValue('123456');
      // jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userService, 'isValidEmail').mockReturnValue(true);
      jest.spyOn(userService, 'isValidPassword').mockReturnValue(true);
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token.access_token);

      const result = await authService.register(body);

      expect(result).toEqual({ userId: user.id, access_token: token });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: '123456',
          email: 'test@example.com',
          password: hashedPassword,
          lastName: 'Doe',
          firstName: 'John',
        },
      });
    });

    it('should throw an error if the email is invalid', async () => {
      const body = {
        email: 'invalidEmail',
        password: 'Password123!',
        lastName: 'Doe',
        firstName: 'John',
      };

      jest.spyOn(userService, 'isValidEmail').mockReturnValue(false);

      await expect(authService.register(body)).rejects.toThrow('Invalid email');
    });

    // Ajoutez plus de tests pour les autres cas d'erreur
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const body = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const user = {
        id: '123456',
        email: 'test@example.com',
        password: 'hashedPassword',
      } as User;
      const token = { access_token: 'jwtToken' }; // Adjusted type

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
      // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token.access_token);

      const result = await authService.login(body);

      expect(result).toEqual({ userId: user.id, access_token: token });
      expect(rabbitmqProducer.userConnected).toHaveBeenCalledWith(user.id);
    });

    it('should throw an error if the user is not found', async () => {
      const body = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(authService.login(body)).rejects.toThrow('User not found');
    });
  });
});
