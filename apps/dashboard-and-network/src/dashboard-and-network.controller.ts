import { Body, Controller, Get } from '@nestjs/common';
import { DashboardAndNetworkService } from './dashboard-and-network.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { CreateCommunity } from 'y/common';

@Controller()
export class DashboardAndNetworkController {
  constructor(
    private readonly dashboardAndNetworkService: DashboardAndNetworkService,
  ) {}

  @MessagePattern('CREATE_COMMUNITY')
  async createCommunity(@Body() body: CreateCommunity) {
    return this.dashboardAndNetworkService.createCommunity(body);
  }

  @MessagePattern('GET_COMMUNITIES')
  async getCommunities() {
    return this.dashboardAndNetworkService.getCommunities();
  }

  @MessagePattern('CREATE_COURSE')
  async createCourse(@Ctx() ctx: RmqContext) {
    console.log('REACHED HERE TWO..!');
    const {
      data: { body, user },
    } = JSON.parse(ctx.getMessage().content.toString());
    console.log('BODY', body, user);
    return this.dashboardAndNetworkService.createCourse(body);
  }
}
