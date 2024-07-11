import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const body = {
        email: 'test@example.com',
        password: 'Password123!',
        lastName: 'Doe',
        firstName: 'John',
      };
      const result = {
        userId: '123456',
        access_token: { access_token: 'jwtToken' },
      }; // Adjusted type
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(body)).toBe(result);
      expect(authService.register).toHaveBeenCalledWith(body);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const body = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const result = {
        userId: '123456',
        access_token: { access_token: 'jwtToken' },
      };
      // jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(body)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(body);
    });
  });
});
