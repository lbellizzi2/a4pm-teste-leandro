import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { DatabaseModule } from '../../commons/database/database.module'
import { AuthUseCase } from './auth.usecase'
import { CryptoModule } from '../crypto/crypto.module'
import { JwtServiceModule } from '../jwt/jwt.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [DatabaseModule, CryptoModule, JwtServiceModule, UserModule],
  controllers: [AuthController],
  providers: [AuthUseCase],
  exports: [AuthUseCase],
})
export class AuthModule {}
