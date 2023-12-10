import {
  Controller,
  Get,
  Res,
  Post,
  HttpCode,
  UseGuards,
  UseInterceptors,
  Req,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { AccessTokenGuard, RefreshTokenGuard } from 'y/common/guards';
import { GetCurrentUser } from 'y/common/decorators';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('REGISTER_USER')
  async registerUser(@Ctx() context: RmqContext, @Body() body: any) {
    return this.authService.register(body);
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
    console.log('REACHED HERE TWO..!');
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
}
