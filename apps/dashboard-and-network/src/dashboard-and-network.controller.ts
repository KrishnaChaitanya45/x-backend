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
    const {
      data: { body, user },
    } = JSON.parse(ctx.getMessage().content.toString());
    return this.dashboardAndNetworkService.createCourse(body, user);
  }

  @MessagePattern('GET_COURSES_OF_INSTRUCTOR')
  async getCoursesOfInstructor(@Ctx() ctx: RmqContext) {
    const {
      data: { instructor_id },
    } = JSON.parse(ctx.getMessage().content.toString());
    return this.dashboardAndNetworkService.getCoursesOfInstructor(
      instructor_id,
    );
  }

  @MessagePattern('GET_SINGLE_COURSE')
  async getSingleCourse(@Ctx() ctx: RmqContext) {
    const {
      data: { course_id },
    } = JSON.parse(ctx.getMessage().content.toString());
    return this.dashboardAndNetworkService.getSingleCourse(course_id);
  }

  @MessagePattern('ADD_MODULE')
  async addModule(@Ctx() ctx: RmqContext) {
    const {
      data: { body, course_id },
    } = JSON.parse(ctx.getMessage().content.toString());
    return this.dashboardAndNetworkService.addModule(body, course_id);
  }

  @MessagePattern('ADD_COURSE_CONTENT')
  async addCourseContent(@Ctx() ctx: RmqContext) {
    const {
      data: { body, module_id },
    } = JSON.parse(ctx.getMessage().content.toString());
    return this.dashboardAndNetworkService.addCourseContent(body, module_id);
  }
}
