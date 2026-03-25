import { Inject, Injectable } from '@nestjs/common';
import {
  BookRepository,
  BOOK_REPOSITORY,
} from '@api/domain/book/BookRepository';
import { BookNotFoundError } from '@api/domain/book/errors/BookNotFoundError';
import { ISBNValue } from '@api/domain/book/value-objects/ISBNValue';
import { BaseDomainError, ResultValue } from '@shared';
import { BookResponseDto } from './dto/BookResponseDto';
import { BookMapper } from './dto/BookMapper';

@Injectable()
export class GetBookByISBNUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(rawIsbn: string): Promise<ResultValue<BookResponseDto, BaseDomainError>> {
    const isbnResult = ISBNValue.create(rawIsbn);
    if (isbnResult.isFailure) {
      return ResultValue.fail(isbnResult.error);
    }

    const result = await this.bookRepository.findByISBN(isbnResult.value);

    if (result.isFailure) {
      return ResultValue.fail(result.error);
    }

    const book = result.value;
    if (!book) {
      return ResultValue.fail(new BookNotFoundError(rawIsbn));
    }

    return ResultValue.ok(BookMapper.toResponse(book));
  }
}
