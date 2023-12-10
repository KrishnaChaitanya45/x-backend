import { Module } from '@nestjs/common';
import { DashboardAndNetworkController } from './dashboard-and-network.controller';
import { DashboardAndNetworkService } from './dashboard-and-network.service';

@Module({
  imports: [],
  controllers: [DashboardAndNetworkController],
  providers: [DashboardAndNetworkService],
})
export class DashboardAndNetworkModule {}
