import { ResultValue, BaseDomainError } from '@shared';
import { BookEntity } from './BookEntity';
import { ISBNValue } from './value-objects/ISBNValue';

export const BOOK_REPOSITORY = Symbol('BookRepository');

export interface BookRepository {
  findById(id: string): Promise<ResultValue<BookEntity | null, BaseDomainError>>;
  findByISBN(isbn: ISBNValue): Promise<ResultValue<BookEntity | null, BaseDomainError>>;
}
