import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DefaultHeadersInterface } from '../../../commons/interfaces/headers';

export const DefaultHeaders = createParamDecorator(
  (data: keyof DefaultHeadersInterface, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers: DefaultHeadersInterface = request?.headers;
    return data ? headers?.[data] : headers;
  },
);
