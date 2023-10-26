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
const User = require('../models/users');
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const messagesRouter = require('../routes/messages');
const mongoDb = process.env.DB_DRIVER_LINK;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
passport.use(new LocalStrategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username' });
        }
        const match = yield bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.get('/log-out', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    });
});
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
//# sourceMappingURL=app.js.map