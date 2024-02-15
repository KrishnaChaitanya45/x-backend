import { Module } from '@nestjs/common';
import { VideoProcessingController } from './video-processing.controller';
import { VideoProcessingService } from './video-processing.service';
import {
  BasePostgresDBModule,
  BasePostgresDBService,
  RmqModule,
  RmqService,
  UtilsService,
} from 'y/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'y/common/cloudinary/Cloudinary.provider';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'y/common/redis/redis.module';

@Module({
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    JwtModule.register({
      secret:
        'c4ae807915c0e423948fb7172b4ae0337ba61820b15ff91e89062f32342a0cd6285e3f4a7f36ebc589ece5e732445b0cd2980fb82f8d77da831c37ec7d3e563b',
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
  ],
  controllers: [VideoProcessingController],
  providers: [
    VideoProcessingService,
    RmqService,
    BasePostgresDBService,
    UtilsService,
    CloudinaryProvider,
  ],
})
export class VideoProcessingModule {}
