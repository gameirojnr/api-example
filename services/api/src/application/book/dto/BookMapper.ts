import { BookEntity } from '@api/domain/book/BookEntity';
import { BookResponseDto } from './BookResponseDto';

export class BookMapper {
  static toResponse(entity: BookEntity): BookResponseDto {
    const dto = new BookResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.isbn = entity.isbn.value;
    dto.author = entity.author;
    dto.description = entity.description;
    dto.publishedDate = entity.publishedDate.toISOString();
    dto.pageCount = entity.pageCount;
    dto.language = entity.language;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
