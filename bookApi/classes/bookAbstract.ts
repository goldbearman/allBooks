import {Ibook} from "../interface/ibook";

export abstract class BooksRepository {
    abstract createBook(book:Ibook): Ibook;
    abstract getBook(id:string): Ibook;
    abstract getBooks(): Ibook[];
    abstract updateBook(id:string): Ibook;
    abstract deleteBook(id:string): void;
}

