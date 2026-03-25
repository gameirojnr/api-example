import { BaseDomainError } from '../../shared/BaseDomainError';
import { DomainHttpCode } from '../../shared/DomainHttpCodeType';

export class BookNotFoundError extends BaseDomainError {
  static readonly statusCode = DomainHttpCode.NOT_FOUND;

  constructor(identifier: string) {
    super(`Book not found: "${identifier}"`);
  }
}
