"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        default: ""
    },
    favorite: {
        type: String,
        default: ""
    },
    fileCover: {
        type: String,
        default: ""
    },
    fileName: {
        type: String,
        default: ""
    },
});
var BookModel = (0, mongoose_1.model)('BookModel', bookSchema);
exports.default = BookModel;
