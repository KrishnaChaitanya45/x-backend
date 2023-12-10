import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '../../../libs/common/src/rabbitMQ/rabbitMQ.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'y/common/statergies';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    RmqModule.register({ name: 'auth' }),
    JwtModule.register({}),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class ApiGatewayModule {}
