import { BaseDomainError, DomainHttpCode } from '@api-example/shared';

export class InvalidISBNError extends BaseDomainError {
  static readonly statusCode = DomainHttpCode.UNPROCESSABLE_ENTITY;

  constructor(isbn: string) {
    super(`Invalid ISBN-13: "${isbn}"`);
  }
}
