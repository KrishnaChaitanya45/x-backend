import { Module } from '@nestjs/common';
import { DashboardAndNetworkController } from './dashboard-and-network.controller';
import { DashboardAndNetworkService } from './dashboard-and-network.service';
import {
  BasePostgresDBModule,
  BasePostgresDBService,
  RmqModule,
} from 'y/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UtilsService } from 'apps/auth/utils/utils.service';

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
  controllers: [DashboardAndNetworkController],
  providers: [DashboardAndNetworkService, UtilsService, BasePostgresDBService],
})
export class DashboardAndNetworkModule {}
