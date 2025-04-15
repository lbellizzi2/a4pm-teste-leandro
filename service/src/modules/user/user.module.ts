import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../commons/database/database.module'
import { CryptoModule } from '../crypto/crypto.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserUseCase } from './user.usecase'

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [UserController],
  providers: [UserService, UserUseCase],
  exports: [UserService, UserUseCase],
})
export class UserModule {}
