import { ApiProperty } from '@nestjs/swagger';

export class BookResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'Clean Code' })
  title: string;

  @ApiProperty({ example: '978-0-13-235088-4' })
  isbn: string;

  @ApiProperty({ example: 'Robert C. Martin' })
  author: string;

  @ApiProperty({ example: 'A handbook of agile software craftsmanship' })
  description: string;

  @ApiProperty({ example: '2008-08-01' })
  publishedDate: string;

  @ApiProperty({ example: 464 })
  pageCount: number;

  @ApiProperty({ example: 'en' })
  language: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: string;
}
