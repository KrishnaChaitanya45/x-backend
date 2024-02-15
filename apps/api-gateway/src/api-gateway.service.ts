import { Injectable, Inject, Res, Body } from '@nestjs/common';
import { RegisterDTO } from './dto/RegisterDTO.dto';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUser } from './dto/LoginUser';
import { Response } from 'express';
import { Observable, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { CreateProfileDTO } from './dto/CreateProfile.dto';
import { CreateCommunity } from 'y/common';
import {
  CREATE_INSTRUCTOR_DTO,
  LOGIN_INSTRUCTOR_DTO,
} from './dto/Instructor.dto';
import { CREATE_COURSE_DTO } from './dto/Course.dto';
import { CREATE_MODULE } from 'libs/common/types/course/CREATE_MODULE';
import { COURSE_CONTENT } from 'libs/common/types/course/CREATE_COURSE_CONTENT';
type RegisterResponse = {
  success: boolean;
  error?: any;
  user?: any;
  tokens?: any;
};
@Injectable()
export class ApiGatewayService {
  constructor(
    @Inject('auth') private readonly authService: ClientProxy,
    @Inject('streaming') private readonly streamService: ClientProxy,
    @Inject('community') private readonly communityService: ClientProxy,
    @Inject('video-processing')
    private readonly videoProcessingService: ClientProxy,
  ) {}
  async loginUser(createUserDTO: LoginUser, @Res() res: Response) {
    try {
      console.log('REACHED HERE ONE..!');
      const result = this.authService.send('LOGIN_USER', createUserDTO);
      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      if (returnedResult.success) {
        res.cookie('refreshToken', returnedResult.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',

          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
    }
  }
  async createUser(createUserDTO: RegisterDTO, @Res() res: Response) {
    try {
      console.log('REACHED HERE ONE..!');
      const result = (await this.authService.send(
        'REGISTER_USER',
        createUserDTO,
      )) as Observable<RegisterResponse>;
      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      if (returnedResult.success) {
        res.cookie('refreshToken', returnedResult.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',

          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
    }
  }
  async findAllUsers() {
    try {
      console.log('REACHED HERE ONE..!');
      const result = this.authService.send(
        'FIND_ALL_USERS',
        {},
      ) as Observable<any>;
      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      return returnedResult;
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
    }
  }
  async updateProfile(
    file: Express.Multer.File,
    @Res() res: Response,
    user: any,
  ) {
    try {
      const result = this.authService.send('UPDATE_PROFILE_PHOTO', {
        file,
        user,
      }) as Observable<any>;
      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      return res.json(returnedResult);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
    }
  }
  async CreateProfile(
    body: CreateProfileDTO,
    @Res({ passthrough: true }) res: Response,
    user: any,
  ) {
    //! For the user object add user/ instructor field
    try {
      console.log('REACHED HERE ONE..!');
      const result = (await this.authService.send('CREATE_USER_PROFILE', {
        body,
        user,
      })) as Observable<RegisterResponse>;
      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }
  async uploadVideo(file: Express.Multer.File, @Res() res: Response) {
    try {
      const result = (await lastValueFrom(
        this.streamService.send('UPLOAD_VIDEO', file),
      )) as { success: boolean; videoURL?: string; error?: any };
      console.log('RESULT OBTAINED', result);

      if (result.success) {
        return res.json(result);
      }
      return res.status(401).json(result);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  async streamVideo(@Res() res: Response) {
    try {
      const result = (await lastValueFrom(
        this.streamService.send('STREAM_VIDEO', {}),
      )) as {
        success: boolean;
        stream?: any;
        error?: any;
        headers?: any;
        contentLength?: number;
      };
      console.log('RESULT OBTAINED', result);

      if (result.success) {
        res.writeHead(206, result.headers);
        result.stream.pipe(res);
      }
      return res.status(401).json(result);
    } catch (error) {
      console.log('STREAM FAILED', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  async createCommunity(body: CreateCommunity, @Res() res: Response) {
    try {
      console.log('REACHED HERE ONE..!');

      const result = (await this.communityService.send(
        'CREATE_COMMUNITY',
        body,
      )) as Observable<any>;
      console.log('RESULT OBTAINED', result);

      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult.error);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  async getCommunities(@Res() res: Response) {
    try {
      console.log('REACHED HERE ONE..!');

      const result = (await this.communityService.send(
        'GET_COMMUNITIES',
        {},
      )) as Observable<any>;
      console.log('RESULT OBTAINED', result);

      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult.error);
    } catch (error) {
      console.log('EXCEPTION HANDLED IN SERVICE THIS TIME', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  // async createInstructorProfile(
  //   @Body() body: CREATE_INSTRUCTOR_DTO,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const result = (await this.authService.send(
  //       'CREATE',
  //       body,
  //     )) as Observable<RegisterResponse>;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async signUpInstructor(body: CREATE_INSTRUCTOR_DTO, @Res() res: Response) {
    try {
      console.log('REACHED HERE ONE..!', body);
      const result = (await this.authService.send('REGISTER_INSTRUCTOR', {
        body,
      })) as Observable<RegisterResponse>;
      const returnedResult = await lastValueFrom(
        result.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      if (returnedResult.success) {
        res.cookie('refreshToken', returnedResult.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',

          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      console.log('CREATE INSTRUCTOR EXCEPTION HAS BEEN HANDLED');
      return res.status(500).json({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async createAdmin(body: RegisterDTO, @Res() res: Response) {
    try {
      const response = await this.authService.send('REGISTER_ADMIN', body);
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        res.cookie('refreshToken', returnedResult.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',

          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async loginAdmin(body: LoginUser, @Res() res: Response) {
    try {
      const response = await this.authService.send('LOGIN_ADMIN', body);
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      if (returnedResult.success) {
        res.cookie('refreshToken', returnedResult.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',

          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async signInInstructor(body: LOGIN_INSTRUCTOR_DTO, @Res() res: Response) {
    try {
      const response = await this.authService.send('LOGIN_INSTRUCTOR', body);
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      if (returnedResult.success) {
        res.cookie('refreshToken', returnedResult.tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',

          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  //? Course Routes
  async createCourse(body: CREATE_COURSE_DTO, @Res() res: Response, user: any) {
    try {
      const response = await this.communityService.send('CREATE_COURSE', {
        body,
        user,
      });
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getAllCourses(instructor_id: string, @Res() res: Response) {
    try {
      const response = await this.communityService.send(
        'GET_COURSES_OF_INSTRUCTOR',
        {
          instructor_id,
        },
      );
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      console.log('RETURNED RESULT', returnedResult);
      if (returnedResult.success) {
        return res.json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getAllInstructors(@Res() res: Response) {
    try {
      const response = await this.authService.send('GET_ALL_INSTRUCTORS', {});
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.status(200).json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
      });
    }
  }
  async addModule(
    instructor_id: string,
    body: CREATE_MODULE,
    course_id: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.communityService.send('ADD_MODULE', {
        instructor_id,
        body,
        course_id,
      });

      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.status(200).json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
      });
    }
  }
  async getSingleCourse(course_id: string, @Res() res: Response) {
    try {
      const response = await this.communityService.send('GET_SINGLE_COURSE', {
        course_id,
      });
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.status(200).json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
      });
    }
  }

  async addCourseContent(
    body: COURSE_CONTENT,
    @Res() res: Response,
    module_id: string,
  ) {
    try {
      const response = await this.communityService.send('ADD_COURSE_CONTENT', {
        body,
        module_id,
      });
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.status(200).json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
      });
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    @Res() res: Response,
    file_name: string,
    folder_name: string,
  ) {
    try {
      const response = await this.authService.send('UPLOAD_IMAGE', {
        file,
        file_name,
        folder_name,
      });
      const returnedResult = await lastValueFrom(
        response.pipe(map((res) => res)),
      );
      if (returnedResult.success) {
        return res.status(200).json(returnedResult);
      }
      return res.status(401).json(returnedResult);
    } catch (error) {
      console.log('HANDLED EXCEPTION IN SERVICE', error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  async uploadVideoWithProcessing(
    @Res() res: Response,
    format: string,
    video: Express.Multer.File,
  ) {
    try {
      const result = await lastValueFrom(
        this.videoProcessingService.send('UPLOAD_VIDEO_PROCESSING', {
          video,
          format,
        }),
      );
      console.log('RESULT OBTAINED', result);
      if (result.success) {
        return res.json(result);
      }
      return res.status(401).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'INTERNAL SERVER ERROR',
      });
    }
  }
}
