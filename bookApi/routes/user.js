const exptress = require('express');
const router = exptress.Router();

const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

verifyPassword = (user, password) => {
  return user.password === password
};

const verify = (username, password, done) => {
  User.findOne({username}, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false)
    }

    if (!verifyPassword(user, password)) {
      return done(null, false)
    }

    return done(null, user)
  })
};

const options = {
  usernameField: "username",
  passwordField: "password",
};

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err)
    }
    cb(null, user)
  })
});

router.get('/', (req, res) => {
  res.render('user/home', {user: req.user})
})

router.get('/login', (req, res) => {
  res.render('user/login')
});

router.get('/signup', (req, res) => {
  res.render('user/signup')
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/api/user/login'}),
  (req, res) => {
    console.log("req.user: ", req.user)
    res.redirect('/api/user')
  })

router.post('/signup', function(req, res, next) {
  let salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt
    ], function(err) {
      if (err) { return next(err); }
      var user = {
        id: this.lastID,
        username: req.body.username
      };
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
  });
});

router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/api/user')
  });
});

router.get('/me',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/api/user/login')
    }
    next()
  },
  (req, res) => {
    res.render('user/profile', {user: req.user})
  }
)
module.exports = router;

console.log(crypto.getHashes());
console.log(crypto.getCiphers());