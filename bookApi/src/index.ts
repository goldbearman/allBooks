import express from 'express';
import mongoose from 'mongoose';

import session from 'express-session';
import passport from 'passport';

import errorMiddleware  from './src/middleware/error';
import indexRouter  from './src/routes/index';
import apiRouter  from './src/routes/apiBooks';
import apiUser  from './src/routes/user';
import apiBooksRouter from './routes/books';
//Chart
import http from 'http';
import socketIO from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketIO(server);

import bodyParser from 'body-parser';

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))  //обработка форм

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/user', apiUser);
app.use('/api/books', apiBooksRouter);
app.use(errorMiddleware);

io.on('connection', (socket) => {
    const {id} = socket;
    // работа с комнатами
    const {roomName} = socket.handshake.query;
    //подписываемся на событие комнаты
    socket.join(roomName);
    socket.on('message-to-room', (msg) => {
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${id}`);
    });
});

async function start(PORT, UrlDB) {
    try {
        await mongoose.connect(UrlDB, {
            user: process.env.DB_USERNAME || 'root',
            pass: process.env.DB_USERNAME || 'example',
            dbName: process.env.DB_NAME || 'book_database',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        server.listen(PORT);
    } catch (e) {
        console.log(e);
    }
}

const UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/';
const PORT = process.env.PORT || 3002;
start(PORT, UrlDB);
