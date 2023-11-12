import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ArtistModule } from './artist/artist.module';
import { MemberModule } from './member/member.module';
import { BuskingModule } from './busking/busking.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { BlockingModule } from './blocking/blocking.module';
import { ReportingModule } from './reporting/reporting.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ArtistModule,
    MemberModule,
    BuskingModule,
    BlockingModule,
    ReportingModule,
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'auth/signup-with-image',
      method: RequestMethod.POST,
    });
  }
}
