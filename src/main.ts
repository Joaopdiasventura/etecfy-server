import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { static as Static } from 'express';
import { join } from 'node:path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: configService.get<string>('client.urls')?.split(';'),
    methods: ['GET', 'DELETE', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
  });

  app.use('/uploads', Static(join(__dirname, '..', 'uploads')));

  await app.listen(configService.get<number>('port')!);
}
bootstrap();
