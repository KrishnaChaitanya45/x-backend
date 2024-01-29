import { Injectable, Inject, Res } from '@nestjs/common';
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
      console.log('REACHED HERE ONE..!');
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
  async test(file: Express.Multer.File, @Res() res: Response) {
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

  async signUpInstructor(body: CREATE_INSTRUCTOR_DTO, @Res() res: Response) {
    try {
      console.log('REACHED HERE ONE..!', body);
      const result = (await this.authService.send(
        'REGISTER_INSTRUCTOR',
        body,
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
      console.log('CREATE INSTRUCTOR EXCEPTION HAS BEEN HANDLED');
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
}
