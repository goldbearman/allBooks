"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invContainer = void 0;
require("reflect-metadata");
var inversify_1 = require("inversify");
var bookAbstract_1 = require("../book/bookAbstract");
var invContainer = new inversify_1.Container();
exports.invContainer = invContainer;
invContainer.bind(bookAbstract_1.BooksRepository).toSelf().inSingletonScope();
