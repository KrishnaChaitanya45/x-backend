import { NestFactory } from '@nestjs/core';
import { VideoProcessingModule } from './video-processing.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from 'y/common';

async function bootstrap() {
  const app = await NestFactory.create(VideoProcessingModule);
  app.enableCors();

  await app.listen(5002, () =>
    console.log('Video processing service is running on port 5002'),
  );
}
bootstrap();
