import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ValidationException } from '../exceptions/validation.exception';
import { HttpMessages } from 'helpers/http-messages.helper';

@Catch(ValidationException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 422;

    response.status(status).json({
      data: {
        message: exception.message,
        errors: {
          errors: exception.errors.reduce(
            (acc, e) => ({
              ...acc,
              [e.property]: Object.values(e.constraints),
            }),
            {},
          ),
        },
      },
      status: {
        code: status,
        message: HttpMessages[status],
        success: false,
      },
    });
  }
}
