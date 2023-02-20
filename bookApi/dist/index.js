"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose = require('mongoose');
var express_session_1 = __importDefault(require("express-session"));
var passport_1 = __importDefault(require("passport"));
var error_1 = require("./middleware/error");
var index_1 = __importDefault(require("./routes/index"));
var apiBooks_1 = require("./routes/apiBooks");
var user_routes_1 = require("./routes/user.routes");
var books_routes_1 = __importDefault(require("./routes/books.routes"));
//Chart
var http = require("http");
var socketIO = require('socket.io');
var app = (0, express_1.default)();
var server = http.Server(app);
var io = socketIO(server);
var body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false })); //обработка форм
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use((0, express_session_1.default)({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', index_1.default);
app.use('/api', apiBooks_1.apiRouter);
app.use('/api/user', user_routes_1.apiUser);
app.use('/api/books', books_routes_1.default);
app.use(error_1.errorMiddleware);
io.on('connection', function (socket) {
    var id = socket.id;
    // работа с комнатами
    var roomName = socket.handshake.query.roomName;
    //подписываемся на событие комнаты
    socket.join(roomName);
    socket.on('message-to-room', function (msg) {
        msg.type = "room: ".concat(roomName);
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });
    socket.on('disconnect', function () {
        console.log("Socket disconnected: ".concat(id));
    });
});
function start(PORT, UrlDB) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, mongoose.connect(UrlDB, {
                            user: process.env.DB_USERNAME || 'root',
                            pass: process.env.DB_USERNAME || 'example',
                            dbName: process.env.DB_NAME || 'book_database',
                            useNewUrlParser: true,
                            useUnifiedTopology: true,
                        })];
                case 1:
                    _a.sent();
                    server.listen(PORT);
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/';
var PORT = parseInt(process.env.PORT, 10) || 3002;
start(PORT, UrlDB);
