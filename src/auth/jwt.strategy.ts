import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtAuthStrategy } from 'passport-jwt';
import {
  Strategy as AppleAuthStrategy,
  Profile,
} from '@arendajaelu/nestjs-passport-apple';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as config from 'config';
import { AuthService } from './auth.service';
import { AppleAuthService } from './apple-auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtAuthStrategy, 'jwt') {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { uid: any }) {
    const { uid } = payload;
    const user: User = await this.userRepository.findOneBy({ uid });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class AppleStrategy extends PassportStrategy(
  AppleAuthStrategy,
  'apple',
) {
  constructor(
    private authService: AuthService,
    private appleAuthService: AppleAuthService,
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      teamID: process.env.TEAM_ID,
      // callbackURL: process.env.APPLE_CALLBACK_URL,
      callbackURL: 'https://macro-app.fly.dev/apple-auth/callback',
      keyID: process.env.KEY_ID,
      key: process.env.AUTH_KEY,
      passReqToCallback: true,
      scope: ['name', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<{ name: string; email: string; appleId: string }> {
    try {
      const jwt = this.appleAuthService.makeJwt();

      if (jwt) {
        const userEntity = {
          name: profile.name?.firstName,
          email: profile.email,
          appleId: profile.id,
        };

        return userEntity;
      } else {
        throw new UnauthorizedException('JWT creation failed');
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
