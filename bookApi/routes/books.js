const exptress = require('express');
const path = require('path');
const axios = require('axios');
const Book = require('../models/book');

const router = exptress.Router();
const {v4: uuid} = require('uuid');
const fileMulter = require('../middleware/bookfile')


// class Book {
//   constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "", id = uuid()) {
//     this.id = id;
//     this.title = title;
//     this.description = description;
//     this.authors = authors;
//     this.favorite = favorite;
//     this.fileCover = fileCover;
//     this.fileName = fileName;
//     this.fileBook = fileBook;
//   }
// }

// const stor = {
//   books: [
//     new Book('Михаил Булгаков - Мастер и Маргарита', 'Это вечная книга, прославившая Булгакова, которого не имеет определённого жанра.'),
//     new Book('Антуан де Сент-Экзюпери - Маленький принц', '«Маленький принц» актуален для любого возраста.'),
//     new Book('Лев Толстой - Война и мир', 'Это вечная книга, прославившая Булгакова, которого не имеет определённого жанра.'),
//   ],
// };

router.get('/', async (req, res) => {
  // const { books } = stor;
  try {
    const books = await Book.find().select('-__v');
    res.render('book/index', {title: 'Books', books: books});
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get('/:id', async (req, res) => {
  // const {books} = stor;
  const {id} = req.params;
  // const idx = books.findIndex(el => el.id === id)

  try {
    const book = await Book.findById(id).select('-__v');

    await axios.post(`http://host.docker.internal/counter/${id}/incr`)
    const resp = await axios.get(`http://host.docker.internal/counter/${id}`)
    await res.render('book/view', {title: 'Book', book: book, count: resp.data});
  } catch (e) {
    res.status(500).json(e);
  }


  // if (idx !== -1) {
  //   try {
  //     await axios.post(`http://host.docker.internal/counter/${id}/incr`)
  //     const resp = await axios.get(`http://host.docker.internal/counter/${id}`)
  //     await res.render('book/view', {title: 'Book', book: books[idx], count: resp.data});
  //   } catch (err) {
  //     await res.render('book/view', {title: 'Book', book: books[idx], count: "подсчитывается..."});
  //     console.log(err);
  //   }
  // } else {
  //   res.redirect('/404')
  // }
});

router.get('/create', (req, res) => {
  res.render('book/create', {title: 'Create book', book: {}});
});

router.post('/create', async (req, res) => {
  // const {books} = stor;
  const {title, description} = req.body;
  const book = new Book({title, description});
  // books.push(book);

  try {
    await book.save();
    res.redirect('/api/books');
  } catch (e) {
    res.status(500).json(e);
  }
});


router.get('/update/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1) {
    res.render('book/update', {title: 'Update book', book: books[idx]});
  } else {
    res.redirect('/404')
  }
});

router.post('/update/:id', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const {title, description} = req.body;
  const idx = books.findIndex(el => el.id === id)

  if (idx !== -1) {
    books[idx] = {
      ...books[idx], title, description,
    }
    res.redirect(`/api/books/${id}`);
  } else {
    res.redirect('/404')
  }
});

router.post('/delete/:id', async (req, res) => {
  // const {books} = stor;
  const {id} = req.params;
  // const idx = books.findIndex(el => el.id === id)

  try {
    await Book.deleteOne({_id: id})
    await res.redirect('/api/books')
  } catch (e) {
    res.status(500).json(e);
  }

  // if (idx !== -1) {
  //   books.splice(idx, 1);
  //   res.redirect('/api/books')
  // } else {
  //   console.log('else')
  //   res.redirect('/404')
  // }
});

router.post('/user/login', (req, res) => {
  const regObj = {id: 1, mail: "test@mail.ru"};
  res.status(201);
  res.json(regObj);
});


router.get('/:id/download', (req, res) => {
  const {books} = stor;
  const {id} = req.params;
  const book = books.find(el => el.id === id);
  if (book) {
    const file = path.join(__dirname, '..', book.fileBook);
    res.download(file, book.fileName);
  } else {
    res.json('Запрашиваемый ресурс не найден!')
  }
});

router.post('/download',
  fileMulter.single('bookFile'),    //(ожидаемое имя файла)
  (req, res) => {
    if (req.file) {
      const {path} = req.file
      if (req.body.bookFile) {
        try {
          const newBook = JSON.parse(req.body.bookFile);
          newBook.fileBook = path;
          newBook.id = uuid();
          if (!keyComparison(new Book(), newBook)) {         //Проверка наличия всех полей
            res.json('Не хватает данных в книге!');
          } else {
            const isNewBook = stor.books.every(el => el.title !== newBook.title && el.authors !== newBook.authors);
            if (isNewBook) {                                  //Проверка дублирующей книги
              stor.books.push(newBook);
              res.json({path})
            } else res.json('Данная книга уже есть!');
          }
        } catch (e) {
          res.json('Неверная структура данных!');
        }
      } else res.json('Неверная структура данных!');
    } else res.json('Нет файла книги!');
    res.json()
  });

router.put('/:id', async (req, res) => {
  // const {books} = stor;
  const {title, description} = req.body;
  const {id} = req.params;
  // const idx = books.findIndex(el => el.id === id);

  try {
    const book = await Book.findByIdAndUpdate(id, {title, description}).select('-__v');
    await res.json(book);
  } catch (e) {
    res.status(500).json(e);
  }

  // if (idx !== -1) {
  //   books[idx] = {
  //     ...books[idx],
  //     title,
  //     description,
  //   };
  //
  //   res.json(books[idx]);
  // } else {
  //   res.status(404);
  //   res.json('404 | страница не найдена');
  // }
});

router.delete('/:id', async (req, res) => {
  // const {books} = stor;
  const {id} = req.params;
  // const idx = books.findIndex(el => el.id === id);

  try {
    await Book.deleteOne({_id: id})
    await res.json(true)
  } catch (e) {
    res.status(500).json(e);
  }

  // if (idx !== -1) {
  //   books.splice(idx, 1);
  //   res.json(true)
  // } else {
  //   res.status(404)
  //   res.json('404 | страница не найдена')
  // }
});

//Functions
function keyComparison(bookExample, book) {
  return Object.keys(bookExample).every(el => {
    return book[el] !== undefined;
  });
}

module.exports = router;