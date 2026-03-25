import { Injectable } from '@nestjs/common';
import { BookRepository } from '@api/domain/book/BookRepository';
import { BookEntity } from '@api/domain/book/BookEntity';
import { ISBNValue } from '@api/domain/book/value-objects/ISBNValue';
import { ResultValue } from '@api/domain/shared/ResultValue';
import { BaseDomainError } from '@shared';

@Injectable()
export class InMemoryBookRepository implements BookRepository {
  private readonly books: BookEntity[];

  constructor() {
    this.books = InMemoryBookRepository.seed();
  }

  async findById(id: string): Promise<ResultValue<BookEntity | null, BaseDomainError>> {
    const book = this.books.find((b) => b.id === id) ?? null;
    return ResultValue.ok(book);
  }

  async findByISBN(isbn: ISBNValue): Promise<ResultValue<BookEntity | null, BaseDomainError>> {
    const book = this.books.find((b) => b.isbn.equals(isbn)) ?? null;
    return ResultValue.ok(book);
  }

  private static seed(): BookEntity[] {
    const booksData = [
      {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        title: 'Clean Code',
        isbn: '9780132350884',
        author: 'Robert C. Martin',
        description: 'A handbook of agile software craftsmanship that teaches the principles, patterns, and practices of writing clean code.',
        publishedDate: new Date('2008-08-01'),
        pageCount: 464,
        language: 'en',
      },
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        title: 'Design Patterns',
        isbn: '9780201633610',
        author: 'Erich Gamma',
        description: 'Elements of reusable object-oriented software, a catalog of simple and succinct solutions to commonly occurring design problems.',
        publishedDate: new Date('1994-10-31'),
        pageCount: 395,
        language: 'en',
      },
      {
        id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        title: 'The Pragmatic Programmer',
        isbn: '9780135957059',
        author: 'David Thomas',
        description: 'Your journey to mastery, covering topics from personal responsibility and career development to architectural techniques.',
        publishedDate: new Date('2019-09-23'),
        pageCount: 352,
        language: 'en',
      },
      {
        id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
        title: 'Domain-Driven Design',
        isbn: '9780321125217',
        author: 'Eric Evans',
        description: 'Tackling complexity in the heart of software by connecting the implementation to an evolving model.',
        publishedDate: new Date('2003-08-30'),
        pageCount: 560,
        language: 'en',
      },
      {
        id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
        title: 'Refactoring',
        isbn: '9780134757599',
        author: 'Martin Fowler',
        description: 'Improving the design of existing code with a catalog of refactorings and guidance on when and how to apply them.',
        publishedDate: new Date('2018-11-20'),
        pageCount: 448,
        language: 'en',
      },
      {
        id: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
        title: 'O Programador Pragmático',
        isbn: '9788575227701',
        author: 'David Thomas',
        description: 'Edição brasileira do clássico The Pragmatic Programmer, cobrindo práticas essenciais de desenvolvimento de software.',
        publishedDate: new Date('2020-03-15'),
        pageCount: 320,
        language: 'pt',
      },
      {
        id: '17a8b9c0-d1e2-3456-abcd-567890123456',
        title: 'Structure and Interpretation of Computer Programs',
        isbn: '9780262510875',
        author: 'Harold Abelson',
        description: 'A foundational textbook on the principles of computer programming, widely considered one of the great computer science texts.',
        publishedDate: new Date('1996-07-25'),
        pageCount: 657,
        language: 'en',
      },
      {
        id: '28b9c0d1-e2f3-4567-bcde-678901234567',
        title: 'Código Limpo',
        isbn: '9788576082675',
        author: 'Robert C. Martin',
        description: 'Versão em português de Clean Code, um guia para escrever código legível, manutenível e de alta qualidade.',
        publishedDate: new Date('2009-06-01'),
        pageCount: 425,
        language: 'pt',
      },
      {
        id: '39c0d1e2-f3a4-5678-cdef-789012345678',
        title: 'Introduction to Algorithms',
        isbn: '9780262046305',
        author: 'Thomas H. Cormen',
        description: 'A comprehensive textbook covering a broad range of algorithms in depth, used worldwide in universities.',
        publishedDate: new Date('2022-04-05'),
        pageCount: 1312,
        language: 'en',
      },
      {
        id: '40d1e2f3-a4b5-6789-defa-890123456789',
        title: 'Working Effectively with Legacy Code',
        isbn: '9780131177055',
        author: 'Michael Feathers',
        description: 'Strategies for working with large, untested legacy code bases, offering techniques to bring them under control.',
        publishedDate: new Date('2004-09-22'),
        pageCount: 456,
        language: 'en',
      },
    ];

    const now = new Date();

    return booksData.map((data) => {
      const isbnResult = ISBNValue.create(data.isbn);
      if (isbnResult.isFailure) {
        throw new Error(`Invalid seed ISBN: ${data.isbn}`);
      }

      const entityResult = BookEntity.restore({
        id: data.id,
        title: data.title,
        isbn: isbnResult.value,
        author: data.author,
        description: data.description,
        publishedDate: data.publishedDate,
        pageCount: data.pageCount,
        language: data.language,
        createdAt: now,
        updatedAt: now,
      });

      if (entityResult.isFailure) {
        throw new Error(`Failed to seed book: ${data.title}`);
      }

      return entityResult.value;
    });
  }
}
