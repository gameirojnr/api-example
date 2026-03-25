import { Module } from '@nestjs/common';
import { BOOK_REPOSITORY } from '@api/domain/book/BookRepository';
import { GetBookUseCase } from '@api/application/book/GetBookUseCase';
import { GetBookByISBNUseCase } from '@api/application/book/GetBookByISBNUseCase';
import { BookController } from './BookController';
import { InMemoryBookRepository } from './InMemoryBookRepository';

@Module({
  controllers: [BookController],
  providers: [
    {
      provide: BOOK_REPOSITORY,
      useClass: InMemoryBookRepository,
    },
    GetBookUseCase,
    GetBookByISBNUseCase,
  ],
})
export class BookModule {}
