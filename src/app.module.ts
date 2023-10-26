import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ArtistModule } from './artist/artist.module';
import { MemberModule } from './member/member.module';
import { BuskingModule } from './busking/busking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ArtistModule,
    MemberModule,
    BuskingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
