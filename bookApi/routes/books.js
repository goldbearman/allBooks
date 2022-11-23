const exptress = require('express');
const path = require('path');
const axios = require('axios');
const Book = require('../models/book');

const router = exptress.Router();
const { v4: uuid } = require('uuid');
const fileMulter = require('../middleware/bookfile')

//Получаем все книги
router.get('/', async (req, res) => {

  try {
    const books = await Book.find().select('-__v');
    // res.render('book/index', { title: 'Books', books: books });
    await res.json(books);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Создаем книгу
router.post('/create',  async (req, res) => {
  const {title, desc} = req.body;
  try {
    const book = new Book({title, description:desc});
    await book.save();
    await res.json(book);
    // res.redirect('/api/books');
  } catch (e) {
    res.status(500).json(e);
  }
});

//Получаем книгу по id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id).select('-__v');
    await axios.post(`http://host.docker.internal/counter/${id}/incr`)
    const resp = await axios.get(`http://host.docker.internal/counter/${id}`)
    // await res.render('book/view', { title: 'Book', book: book, count: resp.data });
    await res.json(book);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Обновляем книгу
router.post('/:id/update', async (req, res) => {
  const { title, desc } = req.body;
  const { id } = req.params;

  try {
    await Book.findByIdAndUpdate(id, { title, description:desc }).select('-__v');
    // await res.redirect('/api/books')
    await res.json('Book update');
  } catch (e) {
    res.status(404).json(e);
  }
});

//Удаляем книгу
router.post('/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    await Book.deleteOne({ _id: id })
    // await res.redirect('/api/books')
    await res.json('ok');
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;