import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD

  app.use(express.json({ limit: '1000mb' })); 
  app.use(express.urlencoded({ limit: '1000mb', extended: true }));

  await app.listen(3000);
=======
  await app.listen(process.env.PORT ?? 3001);
>>>>>>> b73691c89c6da953e1ec66542ac97a727c1af140
}
bootstrap();
