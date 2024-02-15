import { Module } from '@nestjs/common';
import { UtilsService } from './service';
import { BasePostgresDBModule } from '../prisma/basePostgresDB.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    BasePostgresDBModule,
    JwtModule.register({
      secret:
        'c4ae807915c0e423948fb7172b4ae0337ba61820b15ff91e89062f32342a0cd6285e3f4a7f36ebc589ece5e732445b0cd2980fb82f8d77da831c37ec7d3e563b',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
