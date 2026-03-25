import { BaseDomainError, DomainHttpCode } from '@api-example/shared';

export class BookNotFoundError extends BaseDomainError {
  static readonly statusCode = DomainHttpCode.NOT_FOUND;

  constructor(identifier: string) {
    super(`Book not found: "${identifier}"`);
  }
}
