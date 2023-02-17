const exptress = require('express');
const router = exptress.Router();

const bcrypt = require('bcrypt');

const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

verifyPassword = (user, password) => {
  console.log('verifyPassword')
    return bcrypt.compareSync(password, user.password);
};

const verify = (username, password, done) => {
  console.log('verify');
  console.log(username, password)
  User.findOne({username}, (err, user) => {
    console.log(user);
    if (err) {
      console.log(err);
      return done(err)
    }
    if (!user) {
      console.log('!user');
      return done(null, false,{ message: 'Incorrect username or password.' })
    }

    if (!verifyPassword(user, password)) {
      console.log('!verifyPassword');
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
  console.log('serializeUser');
  cb(null, user.id)
});

passport.deserializeUser((id, cb) => {
  console.log('deserializeUser');
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
      return cb(err)
    }
    console.log(user);
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

// router.post('/login',
//   passport.authenticate('local', {failureRedirect: 'api/user/err',failureMessage: true}),
//   async (req, res) => {
//     console.log('in login')
//     res.json(req.user);
//   });

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send(req.user);
    });
  })(req, res, next);
});







// router.get('/err',
//   async (req, res) => {
//     res.json({err:'Неверный логин или пароль'});
//   });

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

function authenticate(strategy, options) {
  return function (req, res, next) {
    passport.authenticate(strategy, options, (error, user , info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return next(new TranslatableError('unauthorised', HTTPStatus.UNAUTHORIZED));
      }
      if (options.session) {
        return req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return next();
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}