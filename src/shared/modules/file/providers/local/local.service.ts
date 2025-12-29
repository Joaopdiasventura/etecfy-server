import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, unlink, stat } from 'node:fs/promises';
import { createWriteStream, existsSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { FileStorageProvider } from '..';

@Injectable()
export class LocalService implements FileStorageProvider {
  private readonly baseUrl: string;
  private readonly publicPath = 'uploads';
  private readonly uploadDir: string;

  public constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('url')!;
    this.uploadDir = resolve(process.cwd(), this.publicPath);
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    await mkdir(this.uploadDir, { recursive: true });
    const safeExt = extname(file.originalname || '')
      .toLowerCase()
      .replace(/[^.\w]/g, '');
    const newName = `${randomUUID()}${safeExt || ''}`;
    const filePath = resolve(this.uploadDir, newName);

    const stream = createWriteStream(filePath);
    const chunkSize = 1024 * 1024;

    for (let i = 0; i < file.buffer.length; i += chunkSize)
      stream.write(file.buffer.subarray(i, i + chunkSize));

    stream.end();

    return new URL(`${this.publicPath}/${newName}`, this.baseUrl).toString();
  }

  public async delete(target: string): Promise<void> {
    const candidate = this.extractFilename(target);
    if (!candidate) return;
    const filePath = resolve(this.uploadDir, candidate);
    if (!existsSync(filePath)) return;
    const st = await stat(filePath);
    if (st.isFile()) await unlink(filePath);
  }

  private extractFilename(target: string): string | null {
    try {
      const u = new URL(target);
      const name = basename(u.pathname);
      return name || null;
    } catch {
      const name = basename(target);
      return name || null;
    }
  }
}
