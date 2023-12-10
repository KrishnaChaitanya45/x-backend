import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BasePostgresDBService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://krishna:krishna@localhost:5440/learningPlatform?schema=public',
        },
      },
    });
  }

  async onModuleInit() {
    this.$connect();
  }
  async onModuleDestroy() {
    this.$disconnect();
  }
}
