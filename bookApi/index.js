const express = require('express');
const mongoose = require('mongoose');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/apiBooks');
const apiBooksRouter = require('./routes/books');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/books', apiBooksRouter);

app.use(errorMiddleware);

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB);
    app.listen(PORT);
  } catch (e) {
    console.log(e);
  }
}

const UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/';
const PORT = process.env.PORT || 3002;
start(PORT, UrlDB);