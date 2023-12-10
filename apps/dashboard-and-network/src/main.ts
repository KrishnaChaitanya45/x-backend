import { NestFactory } from '@nestjs/core';
import { DashboardAndNetworkModule } from './dashboard-and-network.module';

async function bootstrap() {
  const app = await NestFactory.create(DashboardAndNetworkModule);
  await app.listen(3000);
}
bootstrap();
