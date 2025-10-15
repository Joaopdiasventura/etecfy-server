interface IAppConfig {
  url: string;
  env: string;
  port: number;
  salts: number;
  chunkSizeSeconds: number;
  client: {
    url: string;
  };
  jwt: {
    secret: string;
  };
}

export const AppConfig = (): IAppConfig => ({
  url: process.env.APP_URL ?? 'http://localhost:3000',
  env: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  salts: process.env.SALTS ? parseInt(process.env.SALTS) : 5,
  chunkSizeSeconds: process.env.CHUNK_SIZE_SECONDS
    ? parseInt(process.env.CHUNK_SIZE_SECONDS)
    : 10,
  client: { url: process.env.CLIENT_URL ?? '*' },
  jwt: { secret: process.env.JWT_SECRET ?? 'spotify' },
});
