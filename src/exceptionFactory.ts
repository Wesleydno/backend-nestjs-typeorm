import { BadRequestException } from '@nestjs/common';

export interface BadRequestResponse {
  data: {
    message: string;
    errors: Record<string, string[]>;
  };
  status: {
    code: number;
    message: string;
    success: false;
  };
}

export function exceptionFactory(errors): BadRequestException {
  const customException: BadRequestResponse = {
    data: {
      message: 'Validation failed',
      errors: errors.reduce(
        (acc, e) => ({ ...acc, [e.property]: Object.values(e.constraints) }),
        {},
      ),
    },
    status: {
      code: 400,
      message: 'Bad Request',
      success: false,
    },
  };

  return new BadRequestException(customException);
}
