import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { type Express, Request, Response, static as Static } from 'express';
import { join } from 'node:path';
import { AppModule } from './app.module';

let cachedServer: Express | undefined;

async function bootstrap(options?: { listen?: boolean }): Promise<Express> {
  if (cachedServer) return cachedServer;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'DELETE', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (configService.get<string>('env') != 'production')
    app.use('/uploads', Static(join(__dirname, '..', 'uploads')));

  await app.init();

  const shouldListen = options?.listen ?? !process.env.VERCEL;
  if (shouldListen) {
    await app.listen(configService.get<number>('port')!);
  }

  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<unknown> {
  const server = await bootstrap({ listen: false });
  return server(req, res);
}

if (!process.env.VERCEL) bootstrap({ listen: true });
