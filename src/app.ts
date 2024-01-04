const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

const User = require('../../models/users');

const usersRouter = require('../../routes/users');
const messagesRouter = require('../../routes/messages');
const chatroomsRouter = require('../../routes/chatrooms');

const mongoDb = process.env.DB_DRIVER_LINK;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

passport.use(
  new LocalStrategy(async (
    username: string,
    password: string,
    done: (
      arg0: null | unknown,
      arg1?: boolean | undefined,
      arg2?: { message: string; } | undefined
    ) => any,
  ) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user: { id: string; }, done: (arg0: null, arg1: any) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: (arg0: unknown, arg1?: undefined) => void) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const whitelist: Array<string> = ['https://levib00.github.io'];

interface ICorsOptions {
  origin: any,
  credentials: boolean,
}

const corsOptions: ICorsOptions = {
  origin(origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const app: any = express();

app.use(logger('dev'));
app.use(express.json());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.use('/chatrooms', chatroomsRouter);

app.use((req: { user: any; }, res: { locals: { currentUser: any; }; }, next: () => void) => {
  res.locals.currentUser = req.user;
  next();
});

// catch 404 and forward to error handler
app.use((req: any, res: any, next: (arg0: any) => void) => {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((
  err: { message: any; status: any; },
  req: { app: { get: (arg0: string) => string; }; },
  res: {
    locals: { message: any; error: any; };
    status: (arg0: any) => void;
    render: (arg0: string) => void; },
) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
