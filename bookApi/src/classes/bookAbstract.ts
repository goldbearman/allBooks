import {Ibook} from "../interface/ibook";
import Book from '../models/book';

export abstract class BooksRepository {
    async createBook(book: Ibook): Ibook {
        const book = await new Book({title, description:desc});
        await book.save();
    };
    async getBook(id: string): Ibook{

    };
    async getBooks(): Ibook[]{

    };
    async updateBook(id: string): Ibook{

    };
    async deleteBook(id: string): void{

    };
}

