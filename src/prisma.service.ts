import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  relatedModel: unknown; 
  async onModuleInit() {
    await this.$connect();
  }
}