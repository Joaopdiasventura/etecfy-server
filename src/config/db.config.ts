interface IDatabaseConfig {
  postgres: { url: string };
  aws: {
    region: string;
    s3Bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export const DatabaseConfig = (): IDatabaseConfig => ({
  postgres: {
    url:
      process.env.DATABASE_URL ||
      'postgres://postgres:postgres@localhost:5432/etecfy',
  },
  aws: {
    region: process.env.AWS_REGION!,
    s3Bucket: process.env.AWS_S3_BUCKET!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
