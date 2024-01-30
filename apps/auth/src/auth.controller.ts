import { Controller, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('REGISTER_USER')
  async registerUser(@Body() body: any) {
    return this.authService.register(body);
  }

  @MessagePattern('REGISTER_INSTRUCTOR')
  async registerInstructor(@Body() body: any) {
    return this.authService.registerInstructor(body);
  }
  @MessagePattern('LOGIN_INSTRUCTOR')
  async loginInstructor(@Body() body: any) {
    return this.authService.loginInstructor(body);
  }

  @MessagePattern('LOGIN_USER')
  async loginUser(@Ctx() context: RmqContext, @Body() body: any) {
    console.log('REACHED HERE TWO..!');
    return this.authService.login(body);
  }

  @MessagePattern('FIND_ALL_USERS')
  async findUsers(@Ctx() context: RmqContext, @Body() body: any) {
    return this.authService.findAllUsers();
  }
  @MessagePattern('UPDATE_PROFILE_PHOTO')
  async updateProfilePhoto(@Ctx() context: RmqContext, @Body() body: any) {
    const {
      data: { file, user },
    } = JSON.parse(context.getMessage().content.toString());

    return this.authService.uploadProfilePhoto(file, user.userId);
  }

  @MessagePattern('CREATE_USER_PROFILE')
  async createUserProfile(@Ctx() context: RmqContext) {
    const {
      data: { body, user },
    } = JSON.parse(context.getMessage().content.toString());
    return this.authService.createUserProfile(body, user.userId);
  }

  @MessagePattern('GET_ALL_INSTRUCTORS')
  async getAllInstructors(@Ctx() context: RmqContext) {
    return this.authService.getAllInstructors();
  }
}
