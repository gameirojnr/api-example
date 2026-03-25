import { ResultValue } from '../shared/ResultValue';
import { BaseDomainError, DomainHttpCode } from '@api-example/shared';
import { ISBNValue } from './value-objects/ISBNValue';

export interface BookProps {
  id: string;
  title: string;
  isbn: ISBNValue;
  author: string;
  description: string;
  publishedDate: Date;
  pageCount: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BookValidationError extends BaseDomainError {
  static readonly statusCode = DomainHttpCode.UNPROCESSABLE_ENTITY;

  constructor(field: string, reason: string) {
    super(`Invalid book: ${field} ${reason}`);
  }
}

export class BookEntity {
  private constructor(private readonly props: BookProps) {
    Object.freeze(this);
  }

  static restore(props: BookProps): ResultValue<BookEntity, BookValidationError> {
    if (!props.id || props.id.trim().length === 0) {
      return ResultValue.fail(new BookValidationError('id', 'must not be empty'));
    }

    if (!props.title || props.title.trim().length === 0) {
      return ResultValue.fail(new BookValidationError('title', 'must not be empty'));
    }

    return ResultValue.ok(new BookEntity(props));
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get isbn(): ISBNValue {
    return this.props.isbn;
  }

  get author(): string {
    return this.props.author;
  }

  get description(): string {
    return this.props.description;
  }

  get publishedDate(): Date {
    return this.props.publishedDate;
  }

  get pageCount(): number {
    return this.props.pageCount;
  }

  get language(): string {
    return this.props.language;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
