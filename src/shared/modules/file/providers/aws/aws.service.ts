import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { FileStorageProvider } from '..';

@Injectable()
export class AwsService implements FileStorageProvider {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  public constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('aws.region')!;
    this.bucket = this.configService.get<string>('aws.s3Bucket')!;
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId')!,
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey')!,
      },
    });
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    const key = `etecfy/${Date.now()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: Buffer.from(file.buffer),
        ContentType: file.mimetype,
      }),
    );
    return encodeURIComponent(
      `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`,
    );
  }

  public async delete(url: string): Promise<void> {
    const key = new URL(url).pathname.substring(1);
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
