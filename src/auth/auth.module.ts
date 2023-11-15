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
import { User } from './user.entity';
import { UserFollowingController } from '../follow/user-following.controller';
import { ArtistRepository } from 'src/artist/artist.repository';
import { UserFollowingService } from 'src/follow/user-following.service';
import { UploadImageService } from 'src/upload/uploadImage.service';
import { AppleAuthService } from './apple-auth.service';
import { AppleAuthController } from './apple-auth.controller';
import { BuskingService } from 'src/busking/busking.service';
import { MemberService } from 'src/member/member.service';
import { BlockingService } from 'src/blocking/blocking.service';
import { ArtistService } from 'src/artist/artist.service';
import { BuskingRepository } from 'src/busking/busking.repository';
import { MemberRepository } from 'src/member/member.repository';
import * as config from 'config';

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
  controllers: [AuthController, UserFollowingController, AppleAuthController],
  providers: [
    JwtStrategy,
    ArtistRepository,
    UserRepository,
    BuskingRepository,
    MemberRepository,
    AuthService,
    ArtistService,
    UserFollowingService,
    UploadImageService,
    AppleAuthService,
    BuskingService,
    MemberService,
    BlockingService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
