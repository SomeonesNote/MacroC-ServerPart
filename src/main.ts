import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  console.log(`port ${port}`);
  await app.listen(port, '0.0.0.0'); // fly.io deployment
  // await app.listen(3000, '0.0.0.0');
  Logger.log(`Application running on port ${port}`);
}
bootstrap();
