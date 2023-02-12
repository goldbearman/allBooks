import {Ibook} from "../interface/ibook";

export abstract class BooksRepository {
    abstract createBook(book:Ibook): void;
    abstract getBook(id:number): void;
    abstract getBooks(): void;
    abstract updateBook(id:number): void;
    abstract deleteBook(id:number): void;
}

