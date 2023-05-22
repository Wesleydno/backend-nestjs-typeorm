import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(public readonly errors: Record<string, any>) {
    super('Validation failed');
  }
}
