import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
//import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  private readonly logger = new Logger(Auth0Strategy.name);

  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      domain: configService.get<string>('AUTH0_DOMAIN'),
      clientID: configService.get<string>('AUTH0_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AUTH0_CALLBACK_URL'),
      scope: 'openid email profile',
      state: false,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    done: Function,
  ) {
    try {
      this.logger.log(`Validating user with profile id: ${profile.id}`);
      const user = await this.authService.validateUser(
        profile.id,
        profile.emails[0].value,
      );
      if (!user) {
        throw new UnauthorizedException();
      }
      done(null, user);
    } catch (error) {
      this.logger.error('Error during user validation', error.stack);
      done(error, false);
    }
  }
}
