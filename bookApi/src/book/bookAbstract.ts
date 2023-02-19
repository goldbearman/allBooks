import {Ibook} from "./ibook";
import BookModel from './book.model';

interface CreateBook {
    title: Ibook['title'];
    description: Ibook['description'];
}

export abstract class BooksRepository {
    async createBook(data: CreateBook): Promise<Ibook> {
        const newBook = await new BookModel(data);
        await newBook.save();
        return newBook;
    };

    async getBook(id: string): Promise<Ibook | null> {
        return BookModel.findById(id).exec();
    };

    async getBooks(): Promise<Ibook[]> {
        return await BookModel.find().exec();
    };

    async updateBook(id: string, data: CreateBook): Promise<Ibook | null> {
        return await BookModel.findByIdAndUpdate(id, {data}).exec();
    };

    async deleteBook(id: string): Promise<void> {
        await BookModel.deleteOne({_id: id});
    };
}

