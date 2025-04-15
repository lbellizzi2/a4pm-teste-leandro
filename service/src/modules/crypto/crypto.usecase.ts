import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'

@Injectable()
export class CryptoUseCase {
  constructor() {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const saltedPassword = password
    return await bcrypt.hash(saltedPassword, saltRounds)
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const saltedPassword = plainPassword
    return await bcrypt.compare(saltedPassword, hashedPassword)
  }
}
