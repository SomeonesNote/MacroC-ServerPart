import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  await app.listen(3000);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
