import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.stragegy';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import * as config from 'config';
import { User } from './user.entity';
import { UserFollowingController } from '../follow/user-following.controller';
import { ArtistRepository } from 'src/artist/artist.repository';
import { Artist } from 'src/artist/artist.entity';
import { UserFollowingService } from 'src/follow/user-following.service';

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
        limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Artist]),
  ],
  controllers: [AuthController, UserFollowingController],
  providers: [
    JwtStrategy,
    AuthService,
    UserFollowingService,
    ArtistRepository,
    UserRepository,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
