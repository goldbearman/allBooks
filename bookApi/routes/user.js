const exptress = require('express');
const router = exptress.Router();

const bcrypt = require('bcrypt');

const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

verifyPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
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
  console.log(req.user);
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
  async (req, res) => {
    res.redirect('/api/user')
  });

router.post('/signup', async (req, res, next) => {
  try {
    const {username, password, displayName, email} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new User({username, password: hash, displayName, emails: email});
    await user.save();
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/api/user');
    });
  } catch (e) {
    res.status(500).send('Something broke!')
  }
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
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
