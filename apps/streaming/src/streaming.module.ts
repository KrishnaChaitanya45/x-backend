import { Module } from '@nestjs/common';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';
import { RmqModule } from 'y/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from 'y/common/cloudinary/Cloudinary.provider';

@Module({
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [StreamingController],
  providers: [StreamingService, CloudinaryProvider],
})
export class StreamingModule {}
