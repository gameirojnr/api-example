import { BaseDomainError } from '../../shared/BaseDomainError';
import { DomainHttpCode } from '../../shared/DomainHttpCodeType';

export class InvalidISBNError extends BaseDomainError {
  static readonly statusCode = DomainHttpCode.UNPROCESSABLE_ENTITY;

  constructor(isbn: string) {
    super(`Invalid ISBN-13: "${isbn}"`);
  }
}
