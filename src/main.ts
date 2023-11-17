import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  console.log(`port ${port}`);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
