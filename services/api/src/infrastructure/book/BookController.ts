import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetBookUseCase } from '@api/application/book/GetBookUseCase';
import { GetBookByISBNUseCase } from '@api/application/book/GetBookByISBNUseCase';
import { BookResponseDto } from '@api/application/book/dto/BookResponseDto';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(
    private readonly getBookUseCase: GetBookUseCase,
    private readonly getBookByISBNUseCase: GetBookByISBNUseCase,
  ) {}

  @Get('isbn/:isbn')
  @ApiOperation({ summary: 'Get a book by ISBN-13' })
  @ApiParam({ name: 'isbn', description: 'ISBN-13 identifier', example: '978-0-13-468599-1' })
  @ApiResponse({ status: 200, description: 'Book found', type: BookResponseDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 422, description: 'Invalid ISBN-13 format' })
  async getByISBN(@Param('isbn') isbn: string) {
    const result = await this.getBookByISBNUseCase.execute(isbn);

    if (result.isFailure) {
      throw result.error;
    }

    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book UUID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: 'Book found', type: BookResponseDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getById(@Param('id') id: string) {
    const result = await this.getBookUseCase.execute(id);

    if (result.isFailure) {
      throw result.error;
    }

    return result.value;
  }
}
