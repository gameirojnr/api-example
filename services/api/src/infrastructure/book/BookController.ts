import { Controller, Get, Param } from '@nestjs/common';
import { GetBookUseCase } from '@api/application/book/GetBookUseCase';
import { GetBookByISBNUseCase } from '@api/application/book/GetBookByISBNUseCase';

@Controller('books')
export class BookController {
  constructor(
    private readonly getBookUseCase: GetBookUseCase,
    private readonly getBookByISBNUseCase: GetBookByISBNUseCase,
  ) {}

  @Get('isbn/:isbn')
  async getByISBN(@Param('isbn') isbn: string) {
    const result = await this.getBookByISBNUseCase.execute(isbn);

    if (result.isFailure) {
      throw result.error;
    }

    return result.value;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.getBookUseCase.execute(id);

    if (result.isFailure) {
      throw result.error;
    }

    return result.value;
  }
}
