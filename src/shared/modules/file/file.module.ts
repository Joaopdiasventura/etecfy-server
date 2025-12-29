import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { LocalService } from './providers/local/local.service';
import { AwsService } from './providers/aws/aws.service';

@Module({
  imports: [ConfigModule],
  providers: [
    FileService,
    { provide: 'DevelopmentStorage', useClass: LocalService },
    { provide: 'ProductionStorage', useClass: AwsService },
  ],
  exports: [FileService],
})
export class FileModule {}
