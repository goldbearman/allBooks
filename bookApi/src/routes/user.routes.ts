import {Iuser} from "../user/iuser";

const exptress = require('express');
import {Error} from 'mongoose';
import {Request, Response, NextFunction} from 'express'
const router = exptress.Router();

const bcrypt = require('bcrypt');

const User = require('../user/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const verifyPassword = (user:Iuser, password:string):boolean => {
  console.log('verifyPassword')
    return bcrypt.compareSync(password, user.password);
};

const verify = (username:string, password:string, done:any) => {
  console.log('verify');
  console.log(username, password)
  User.findOne({username}, (err:Error, user:Iuser) => {
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

passport.serializeUser((user:Iuser, cb:any) => {
  console.log('serializeUser');
  cb(null, user.id)
});

passport.deserializeUser((id:string, cb:any) => {
  console.log('deserializeUser');
  User.findById(id, (err:Error, user:Iuser) => {
    if (err) {
      console.log(err);
      return cb(err)
    }
    console.log(user);
    cb(null, user)
  })
});

router.get('/', (req: Request, res: Response) => {
  res.render('user/home', {user: req.user})
})

router.get('/login', (req: Request, res: Response) => {
  res.render('user/login')
});

router.get('/signup', (req: Request, res: Response) => {
  res.render('user/signup')
});

router.post('/login', function(req: Request, res: Response, next:NextFunction  ) {
  passport.authenticate('local', function(err:Error, user:Iuser) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send(req.user);
    });
  })(req, res, next);
});

router.post('/signup', async (req: Request, res: Response, next:NextFunction) => {
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

router.get('/logout', (req: Request, res: Response, next:NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/api/user')
  });
});

router.get('/me',
  (req: Request, res: Response, next:NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/api/user/login')
    }
    next()
  },
  (req: Request, res: Response) => {
    res.render('user/profile', {user: req.user})
  }
)

export {router as apiUser};

