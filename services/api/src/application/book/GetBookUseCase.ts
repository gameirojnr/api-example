import { Inject, Injectable } from '@nestjs/common';
import {
  BookRepository,
  BOOK_REPOSITORY,
} from '@api/domain/book/BookRepository';
import { BookNotFoundError } from '@api/domain/book/errors/BookNotFoundError';
import { BaseDomainError } from '@api/domain/shared/BaseDomainError';
import { ResultValue } from '@api/domain/shared/ResultValue';
import { BookResponseDto } from './dto/BookResponseDto';
import { BookMapper } from './dto/BookMapper';

@Injectable()
export class GetBookUseCase {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(id: string): Promise<ResultValue<BookResponseDto, BaseDomainError>> {
    const result = await this.bookRepository.findById(id);

    if (result.isFailure) {
      return ResultValue.fail(result.error);
    }

    const book = result.value;
    if (!book) {
      return ResultValue.fail(new BookNotFoundError(id));
    }

    return ResultValue.ok(BookMapper.toResponse(book));
  }
}
