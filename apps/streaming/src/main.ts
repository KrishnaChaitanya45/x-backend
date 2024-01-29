import { NestFactory } from '@nestjs/core';
import { StreamingModule } from './streaming.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqService } from 'y/common';
async function bootstrap() {
  const app = await NestFactory.create(StreamingModule);

  const RABBITMQ_CONTAINER_NAME = 'localhost'; // Update with your RabbitMQ container name

  const rabbitMQ_Service = await app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(
    rabbitMQ_Service.getOptions(
      'streaming',
      true,
      `amqp://${'Nishant'}:${'Nishant'}@${RABBITMQ_CONTAINER_NAME}:5672`,
    ),
  );
  await app.startAllMicroservices();
  app.enableCors();
  app.listen(5003, () =>
    console.log('Streaming service is running on port 5003'),
  );
}
bootstrap();
