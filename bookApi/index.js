const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session')
const passport = require('passport')

const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/apiBooks');
const apiUser = require('./routes/user');
const apiBooksRouter = require('./routes/books');
//Chart
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

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
