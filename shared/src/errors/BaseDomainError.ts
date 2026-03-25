import { DomainHttpCode } from './DomainHttpCode';

export abstract class BaseDomainError extends Error {
  static readonly statusCode: DomainHttpCode;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  get statusCode(): DomainHttpCode {
    return (this.constructor as typeof BaseDomainError).statusCode;
  }
}
