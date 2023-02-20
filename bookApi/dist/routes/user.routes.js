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
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiUser = void 0;
var exptress = require('express');
var router = exptress.Router();
exports.apiUser = router;
var bcrypt = require('bcrypt');
var User = require('../user/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var verifyPassword = function (user, password) {
    console.log('verifyPassword');
    return bcrypt.compareSync(password, user.password);
};
var verify = function (username, password, done) {
    console.log('verify');
    console.log(username, password);
    User.findOne({ username: username }, function (err, user) {
        console.log(user);
        if (err) {
            console.log(err);
            return done(err);
        }
        if (!user) {
            console.log('!user');
            return done(null, false, { message: 'Incorrect username or password.' });
        }
        if (!verifyPassword(user, password)) {
            console.log('!verifyPassword');
            return done(null, false);
        }
        return done(null, user);
    });
};
var options = {
    usernameField: "username",
    passwordField: "password",
};
passport.use('local', new LocalStrategy(options, verify));
passport.serializeUser(function (user, cb) {
    console.log('serializeUser');
    cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
    console.log('deserializeUser');
    User.findById(id, function (err, user) {
        if (err) {
            console.log(err);
            return cb(err);
        }
        console.log(user);
        cb(null, user);
    });
});
router.get('/', function (req, res) {
    res.render('user/home', { user: req.user });
});
router.get('/login', function (req, res) {
    res.render('user/login');
});
router.get('/signup', function (req, res) {
    res.render('user/signup');
});
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.send({ success: false, message: 'authentication failed' });
        }
        req.login(user, function (loginErr) {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send(req.user);
        });
    })(req, res, next);
});
router.post('/signup', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, displayName, email, hash, user, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, password = _a.password, displayName = _a.displayName, email = _a.email;
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1:
                hash = _b.sent();
                user = new User({ username: username, password: hash, displayName: displayName, emails: email });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                req.login(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/api/user');
                });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                res.status(500).send('Something broke!');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/api/user');
    });
});
router.get('/me', function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/api/user/login');
    }
    next();
}, function (req, res) {
    res.render('user/profile', { user: req.user });
});