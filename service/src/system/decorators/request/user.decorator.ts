import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '@/commons/interfaces/user';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const data: IUser = request.user;
    return data;
  },
);
