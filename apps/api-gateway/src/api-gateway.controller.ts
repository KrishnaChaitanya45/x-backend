import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { RegisterDTO } from './dto/RegisterDTO.dto';
import { LoginUser } from './dto/LoginUser';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'y/common/guards';
import { GetCurrentUser } from 'y/common/decorators';
import { CreateProfileDTO } from './dto/CreateProfile.dto';
import axios from 'axios';
import { CreateCommunity } from 'y/common';
import {
  CREATE_INSTRUCTOR_DTO,
  LOGIN_INSTRUCTOR_DTO,
} from './dto/Instructor.dto';
import { CREATE_COURSE_DTO } from './dto/Course.dto';
@Controller('api/v1')

/*
! TODO
? Add new Guard for instructor
? Differentiate and reUse the objects for student and instructor
* Add course creation / update / delete
* Module Creation / Update / Delete
* Lesson Creation / Update / Delete
* Add course enrollment
*/
export class ApiGatewayController {
  constructor(private readonly apiGatewayService: ApiGatewayService) {}

  //? AUTH ROUTES
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

  @Post('/auth/test')
  @UseInterceptors(FileInterceptor('video'))
  uploadVideo(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    try {
      console.log('FILE UPLOADED', file);
      return this.apiGatewayService.test(file, res);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }

  @Get('/auth/test')
  async streamVideo(@Req() req: Request, @Res() res: Response) {
    try {
      const streamingMicroserviceURL = 'http://localhost:5003/streaming';

      axios({
        method: 'get',
        url: streamingMicroserviceURL,
        responseType: 'stream',
      })
        .then(function (response) {
          response.data.pipe(res);
        })
        .catch(function (error) {
          console.error('Proxy Request Error:', error);
          res.status(500).send('Error streaming video');
        });
    } catch (error) {
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  //? COMMUNITIES ROUTES
  @UseGuards(AccessTokenGuard)
  @Post('/communities/create')
  async createCommunity(@Body() body: CreateCommunity, @Res() res: Response) {
    try {
      return this.apiGatewayService.createCommunity(body, res);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }

  @Get('/communities')
  async getCommunities(@Res() res: Response) {
    try {
      return this.apiGatewayService.getCommunities(res);
    } catch (error) {
      console.log('EXCEPTION HANDLED', error);
    }
  }

  //? INSTRUCTOR ROUTES
  @Post('/auth/instructor/create-profile')
  async createInstructorProfile(
    @Body() body: CREATE_INSTRUCTOR_DTO,
    @Res() res: Response,
  ) {
    return this.apiGatewayService.signUpInstructor(body, res);
  }

  //? INSTRUCTOR ROUTES
  @Post('/auth/instructor/login')
  async loginInstructorProfile(
    @Body() body: LOGIN_INSTRUCTOR_DTO,
    @Res() res: Response,
  ) {
    return this.apiGatewayService.signInInstructor(body, res);
  }

  //? COURSES ROUTES
  @UseGuards(AccessTokenGuard)
  @Post('/courses/create')
  async createCourse(
    @GetCurrentUser() user: any,
    @Body() body: CREATE_COURSE_DTO,
    @Res() res: Response,
  ) {
    return this.apiGatewayService.createCourse(body, res, user);
  }
}
