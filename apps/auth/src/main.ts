import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqService } from 'y/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const USER = configService.get<string>('RABBIT_MQ_USER');
  const PASSWORD = configService.get<string>('RABBIT_MQ_PASS');
  const RABBITMQ_CONTAINER_NAME = 'localhost'; // Update with your RabbitMQ container name

  const rabbitMQ_Service = await app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(
    rabbitMQ_Service.getOptions(
      'auth',
      true,
      `amqp://${USER || 'Nishant'}:${
        PASSWORD || 'Nishant'
      }@${RABBITMQ_CONTAINER_NAME}:5672`,
    ),
  );
  await app.startAllMicroservices();
}

bootstrap();
