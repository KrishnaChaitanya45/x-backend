import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common/decorators';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: true,
      secretOrKey:
        'fd8f1e9a31e4c7d100b3af4ee01fcd148539b71cd23b3ebab87f096fb6df766d5f34f2aa8efbfc8639cedee8080df7a0110c7de47f1c31124dd67b56592e49e6',
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization').split(' ')[1];
    return {
      userId: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}
