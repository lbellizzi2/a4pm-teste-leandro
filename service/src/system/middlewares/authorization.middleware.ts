import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthService } from '../../modules/jwt/jwt.service';

@Injectable()
export class JwtAuthorizationRequestMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtAuthService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const authToken = req.header('authorization');

    if (!authToken)
      throw new UnauthorizedException('Validation failed (token is expected)');

    const authTokenArr = authToken.split(' ');

    if (authTokenArr.length !== 2 || authTokenArr[0] !== 'Bearer')
      throw new UnauthorizedException('Expected Bearer token');

    const decoded = await this.jwtService.decodeAuthToken(authTokenArr[1]);

    if (!decoded) throw new UnauthorizedException();

    next();
  }
}
