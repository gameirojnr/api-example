import { BaseDomainError, DomainHttpCode } from '@shared';

export class InvalidISBNError extends BaseDomainError {
  static readonly statusCode = DomainHttpCode.UNPROCESSABLE_ENTITY;

  constructor(isbn: string) {
    super(`Invalid ISBN-13: "${isbn}"`);
  }
}
