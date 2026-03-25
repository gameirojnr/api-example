import { ResultValue } from '../shared/ResultValue';
import { BookEntity } from './BookEntity';
import { ISBNValue } from './value-objects/ISBNValue';
import { BaseDomainError } from '@shared';

export const BOOK_REPOSITORY = Symbol('BookRepository');

export interface BookRepository {
  findById(id: string): Promise<ResultValue<BookEntity | null, BaseDomainError>>;
  findByISBN(isbn: ISBNValue): Promise<ResultValue<BookEntity | null, BaseDomainError>>;
}
