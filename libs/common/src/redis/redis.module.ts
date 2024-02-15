import { Module } from '@nestjs/common';

import { redisClientFactory } from './redis.client.factory';
import { RedisRepository } from './redis.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisRepository],

  exports: [RedisRepository],
})
export class RedisModule {}
