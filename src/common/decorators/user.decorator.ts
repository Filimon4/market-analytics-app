import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return data ? request.user?.[data] : request.user;
});
