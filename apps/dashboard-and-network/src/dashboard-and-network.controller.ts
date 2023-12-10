import { Controller, Get } from '@nestjs/common';
import { DashboardAndNetworkService } from './dashboard-and-network.service';

@Controller()
export class DashboardAndNetworkController {
  constructor(private readonly dashboardAndNetworkService: DashboardAndNetworkService) {}

  @Get()
  getHello(): string {
    return this.dashboardAndNetworkService.getHello();
  }
}
