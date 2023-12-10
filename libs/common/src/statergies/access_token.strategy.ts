import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common/decorators';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        'c4ae807915c0e423948fb7172b4ae0337ba61820b15ff91e89062f32342a0cd6285e3f4a7f36ebc589ece5e732445b0cd2980fb82f8d77da831c37ec7d3e563b',
      ignoreExpiration: true,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
