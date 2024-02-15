import { NestFactory } from '@nestjs/core';
import { DashboardAndNetworkModule } from './dashboard-and-network.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from 'y/common';

async function bootstrap() {
  const app = await NestFactory.create(DashboardAndNetworkModule);
  const RABBITMQ_CONTAINER_NAME = 'localhost'; // Update with your RabbitMQ container name

  const rabbitMQ_Service = await app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(
    rabbitMQ_Service.getOptions(
      'community',
      true,
      `amqp://Nishant:Nishant@${RABBITMQ_CONTAINER_NAME}:5672`,
    ),
  );
  await app.startAllMicroservices();
}
bootstrap();
