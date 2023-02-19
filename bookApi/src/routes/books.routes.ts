import {Request, Response} from 'express'
const express = require('express');
import path from 'path';
import axios from 'axios';
import BookModel from '../book/book.model';

const rout = express.Router();

import {v4 as uuid} from 'uuid';
import fileMulter from '../middleware/bookfile';
import {Ibook, IGetUserAuthInfoRequest} from "../book/ibook";
//IoC
import {invContainer} from "../infrastructure/container";
import {BooksRepository} from "../book/bookAbstract";


const bookRepo = invContainer.get(BooksRepository);

rout.get('/', async (req: Request, res: Response) => {
    try {
        const books = await bookRepo.getBooks();
        res.render('book/index', {title: 'Books', books: books});
    } catch (e) {
        await res.status(500).json(e);
    }
});

rout.get('/create', (req: Request, res: Response) => {
    res.render("book/create", {
        title: "Сreate book",
        book: {},
    });
});

rout.post('/create', async (req: Request, res: Response) => {
    const {title, description} = req.body;
    try {
        const book = bookRepo.createBook({title, description});
        res.redirect('/api/books');
    } catch (e) {
        await res.status(500).json(e);
    }
});

rout.get('/:id', async (req: IGetUserAuthInfoRequest, res: Response) => {
    const {id} = req.params;
    const {user} = req;
    try {
        const book = bookRepo.getBook(id);
        await axios.post(`http://host.docker.internal/counter/${id}/incr`)
        const resp = await axios.get(`http://host.docker.internal/counter/${id}`)
        let userName = user ? user.displayName : "anonymous";
        await res.render('book/view', {title: 'BookModel', book: book, count: resp.data, userName: userName});
    } catch (e) {
        await res.status(500).json(e);
    }
});

rout.get('/update/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const book = await bookRepo.getBook(id);
        await res.render('book/update', {title: 'Update book', book: book});
    } catch (e) {
        await res.status(500).json(e);
    }
});

rout.post('/update/:id', async (req: Request, res: Response) => {
    const {title, desc} = req.body;
    const {id} = req.params;

    try {
        const book = await bookRepo.updateBook(id, {title, description: desc});
        await res.redirect('/api/books')
    } catch (e) {
        await res.status(500).json(e);
    }
});

rout.post('/delete/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        await bookRepo.deleteBook(id);
        await res.redirect('/api/books')
    } catch (e) {
        await res.status(500).json(e);
    }
});

rout.post('/user/login', (req: Request, res: Response) => {
    const regObj = {id: 1, mail: "test@mail.ru"};
    res.status(201);
    res.json(regObj);
});

// rout.get('/:id/download', (req: Request, res: Response) => {
//     const {books} = stor;
//     const {id} = req.params;
//     const book = books.find(el => el.id === id);
//     if (book) {
//         const file = path.join(__dirname, '..', book.fileBook);
//         res.download(file, book.fileName);
//     } else {
//         res.json('Запрашиваемый ресурс не найден!')
//     }
// });
//
// rout.post('/download',
//     fileMulter.single('bookFile'),    //(ожидаемое имя файла)
//     (req: Request, res: Response) => {
//         if (req.file) {
//             const {path} = req.file
//             if (req.body.bookFile) {
//                 try {
//                     const newBook = JSON.parse(req.body.bookFile);
//                     newBook.fileBook = path;
//                     newBook.id = uuid();
//                     if (!keyComparison(new BookModel(), newBook)) {         //Проверка наличия всех полей
//                         res.json('Не хватает данных в книге!');
//                     } else {
//                         const isNewBook = stor.books.every(el => el.title !== newBook.title && el.authors !== newBook.authors);
//                         if (isNewBook) {                                  //Проверка дублирующей книги
//                             stor.books.push(newBook);
//                             res.json({path})
//                         } else res.json('Данная книга уже есть!');
//                     }
//                 } catch (e) {
//                     res.json('Неверная структура данных!');
//                 }
//             } else res.json('Неверная структура данных!');
//         } else res.json('Нет файла книги!');
//         res.json()
//     });

rout.put('/:id', async (req: Request, res: Response) => {
    const {title, description} = req.body;
    const {id} = req.params;

    try {
        const book = await bookRepo.updateBook(id, {title, description});
        await res.json(book);
    } catch (e) {
        res.status(500).json(e);
    }
});

rout.delete('/:id', async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        await bookRepo.deleteBook(id);
        await res.json(true)
    } catch (e) {
        res.status(500).json(e);
    }
});

//Functions
function keyComparison(bookExample: Ibook, book: Ibook): boolean {
    return Object.keys(bookExample).every(el => {
        return book[el] !== undefined;
    });
}

export default rout;