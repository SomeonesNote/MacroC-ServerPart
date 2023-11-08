import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TestingUserRepository, UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from './user.entity';
import { TestingUser } from './user.entity';
import * as config from 'config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private testingUserRepository: TestingUserRepository,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { username } = payload;
    const user: TestingUser = await this.testingUserRepository.findOneBy({
      username,
    });
    // const { uid } = payload;
    // const user: User = await this.userRepository.findOneBy({ uid });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passreqToCallback: true,
    });
  }

  validate(req: Request, payload) {
    const refreshToken = req.get('Authorization').split('Bearer ')[1];

    if (refreshToken !== payload.refreshToken) {
      throw new UnauthorizedException();
    }
    return {
      ...payload,
      refreshToken,
    };
  }
}
