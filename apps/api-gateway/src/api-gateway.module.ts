import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '../../../libs/common/src/rabbitMQ/rabbitMQ.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'y/common/statergies';
import { JwtModule } from '@nestjs/jwt';
import {
  BasePostgresDBModule,
  BasePostgresDBService,
  UtilsModule,
  UtilsService,
} from 'y/common';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    RmqModule.register({ name: 'auth' }),
    RmqModule.register({ name: 'streaming' }),
    RmqModule.register({ name: 'community' }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    UtilsModule,
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    RefreshTokenStrategy,
    BasePostgresDBService,
    UtilsService,
    AccessTokenStrategy,
  ],
})
export class ApiGatewayModule {}
