import { Module } from '@nestjs/common';
import { PrismaDatabase } from './prisma.database';

@Module({
  providers: [PrismaDatabase],
  exports: [PrismaDatabase],
})
export class DatabaseModule {}
