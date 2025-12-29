import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './config/app.config';
import { DatabaseConfig } from './config/db.config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [AppConfig, DatabaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('postgres.url'),
        synchronize: configService.get('env') == 'development',
        logging: configService.get('env') == 'development',
        type: 'postgres',
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity.ts'],
      }),
    }),
    CoreModule,
  ],
})
export class AppModule {}
