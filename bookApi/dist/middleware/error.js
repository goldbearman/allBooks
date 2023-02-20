"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
exports.errorMiddleware = (function (req, res) {
    res.render('errors/404', {
        title: '404'
    });
});
