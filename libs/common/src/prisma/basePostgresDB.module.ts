import { Module } from '@nestjs/common';
import { BasePostgresDBService } from './basePostgresDB.service';

@Module({
  providers: [BasePostgresDBService],
  exports: [BasePostgresDBService],
})
export class BasePostgresDBModule {}
