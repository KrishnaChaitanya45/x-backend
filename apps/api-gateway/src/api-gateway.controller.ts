import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseInterceptors,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { RegisterDTO } from './dto/RegisterDTO.dto';
import { LoginUser } from './dto/LoginUser';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'y/common/guards';
import { GetCurrentUser } from 'y/common/decorators';
import { CreateProfileDTO } from './dto/CreateProfile.dto';
@Controller('api/v1')
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  @Post('/auth/register')
  createUser(@Body() createUserDTO: RegisterDTO, @Res() res: Response) {
    try {
      console.log(createUserDTO);
      return this.apiGatewayService.createUser(createUserDTO, res);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }
  @Post('/auth/login')
  logInUser(@Body() createUserDTO: LoginUser, @Res() res: Response) {
    try {
      return this.apiGatewayService.loginUser(createUserDTO, res);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }
  @Get('/auth/users')
  findAllUsers() {
    try {
      return this.apiGatewayService.findAllUsers();
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }
  @UseGuards(AccessTokenGuard)
  @Post('/auth/create-profile')
  createUserProfile(
    @GetCurrentUser() user: any,
    @Body() body: CreateProfileDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.apiGatewayService.CreateProfile(body, res, user);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  @Post('/auth/update-profile-photo')
  updateProfile(
    @GetCurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!file) {
        return res.status(404).json({
          message: 'FILE NOT INCLUDED',
        });
      }
      return this.apiGatewayService.updateProfile(file, res, user);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }
}
