import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '1000mb' })); 
  app.use(express.urlencoded({ limit: '1000mb', extended: true }));

  await app.listen(3000);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
