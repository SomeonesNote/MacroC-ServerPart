import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import * as config from 'config';
import { User } from './user.entity';
import { UserFollowingController } from '../follow/user-following.controller';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserFollowingService } from 'src/follow/user-following.service';
import { UploadImageService } from 'src/upload/uploadImage.service';
import { AppleRevokeService } from './apple-revoke.service';
import { AppleRevokeController } from './apple-revoke.controller';

const jwtConfig = config.get('jwt');
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
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
  ],
  controllers: [AuthController, UserFollowingController, AppleRevokeController],
  providers: [
    JwtStrategy,
    AuthService,
    UserFollowingService,
    AppleRevokeService,
    ArtistRepository,
    UserRepository,
    UploadImageService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
