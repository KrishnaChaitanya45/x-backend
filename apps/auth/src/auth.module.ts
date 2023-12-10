import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  BasePostgresDBModule,
  BasePostgresDBService,
  RmqModule,
} from 'y/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UtilsService } from '../utils/utils.service';
import { CloudinaryProvider } from 'y/common/cloudinary/Cloudinary.provider';

@Module({
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    BasePostgresDBModule,
    JwtModule.register({
      secret:
        'c4ae807915c0e423948fb7172b4ae0337ba61820b15ff91e89062f32342a0cd6285e3f4a7f36ebc589ece5e732445b0cd2980fb82f8d77da831c37ec7d3e563b',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BasePostgresDBService,
    JwtService,
    UtilsService,
    CloudinaryProvider,
  ],
})
export class AuthModule {}
