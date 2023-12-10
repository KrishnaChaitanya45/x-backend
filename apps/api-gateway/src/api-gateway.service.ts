import { Injectable, Inject, Res } from '@nestjs/common';
import { RegisterDTO } from './dto/RegisterDTO.dto';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUser } from './dto/LoginUser';
import { Response } from 'express';
import { Observable, lastValueFrom, map } from 'rxjs';
import { CreateProfileDTO } from './dto/CreateProfile.dto';
type RegisterResponse = {
  success: boolean;
  error?: any;
  user?: any;
  tokens?: any;
};
@Injectable()
export class ApiGatewayService {
  constructor(@Inject('auth') private readonly authService: ClientProxy) {}
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
}
