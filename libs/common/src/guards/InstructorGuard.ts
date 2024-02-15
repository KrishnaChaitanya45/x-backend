import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UtilsService } from '../utils/service';
import { Observable } from 'rxjs';
import { AccessTokenStrategy } from '../statergies';

@Injectable()
// implements CanActivate
export default class InstructorGuard extends AuthGuard('access-jwt') {
  constructor(private readonly utilsService: UtilsService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const {
      headers: { authorization },
    } = request;
    if (!authorization) {
      throw new UnauthorizedException();
    }
    const accessToken = authorization.split(' ')[1];
    const user = await this.utilsService.verifyAccessToken(accessToken);
    request.user = user;
    if (!user && !user.userId) {
      throw new UnauthorizedException();
    }
    const isInstructor = await this.utilsService.checkIsInstructor(user.userId);
    if (!isInstructor) {
      throw new UnauthorizedException();
    }

    return true;
  }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   try {
  //     const isAuth = await this.accessTokenStrategy.canActivate(context, true);
  //     if (!isAuth) {
  //       throw new UnauthorizedException();
  //     }
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }
}
