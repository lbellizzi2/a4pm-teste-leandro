import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoUseCase } from './crypto.usecase';

@Module({
  imports: [ConfigModule],
  providers: [CryptoUseCase],
  exports: [CryptoUseCase],
})
export class CryptoModule {}
