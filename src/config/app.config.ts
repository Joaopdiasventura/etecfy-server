interface IAppConfig {
  port: number;
  salts: number;
  url: string;
  env: string;
  client: { urls: string };
  jwt: { secret: string };
}

export const AppConfig = (): IAppConfig => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  salts: process.env.SALTS ? parseInt(process.env.SALTS) : 5,
  url: process.env.URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development',
  client: {
    urls: process.env.CLIENT_URLS || 'http://localhost:4200',
  },
  jwt: { secret: process.env.JWT_SECRET ?? 'etecfy' },
});
