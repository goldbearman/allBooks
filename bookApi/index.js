const express = require('express');

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/apiBooks');
const apiBooksRouter = require('./routes/books');

const app = express();
app.use(express.urlencoded());
app.set('view engine','ejs');


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/books', apiBooksRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3002;
app.listen(PORT);