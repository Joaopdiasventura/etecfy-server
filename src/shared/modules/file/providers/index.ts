export interface FileStorageProvider {
  upload(file: Express.Multer.File): Promise<string>;
  delete(target: string): Promise<void>;
}
