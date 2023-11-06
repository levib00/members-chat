/* *
*@jest-environment node
*/
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = require('../users');

const User = require('../../models/users');
const Chatroom = require('../../models/chatroom');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/users', users);

test('sign up checks for wrong passwords', (done) => {
  request(app)
    .post('/users/sign-up')
    .type('form')
    .send({
      body: {
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        confirmPassword: '987654321',
      },
    })
    .expect({ error: 'Passwords do not match.' })
    .expect(403, done);
});

describe('All users get', () => {
  beforeAll(() => {
    User.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatroom: [],
    },
    {
      _id: '5dbff89209dee20b18091ec3',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatroom: [],
    },
    ]);
  });

  test('Returns forbidden error if not admin', (done) => {
    const user = {
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatroom: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .get('/users/')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect({ error: 'Forbidden' })
      .expect(403, done);
  });

  test('gets all users if user is admin', (done) => {
    const user = {
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatroom: [],
    };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    request(app)
      .get('/users/')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('Join chat room', () => {
  beforeAll(() => {
    User.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    },
    ]);

    User.findByIdAndUpdate = jest.fn();

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f47',
      roomName: 'myname',
      password: '123456789',
      isPublic: false,
    },
    );
  });

  test('Unauthorized response if passwords do not match', (done) => {
    bcrypt.compare = jest.fn()
      .mockResolvedValue(false);

    const user = {
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/users/5dbff32e367a343830cd2f49/5dbff32e367a343830cd2f47')
      .set({ Authorization: `Bearer ${token}` })
      .send({ body: { passowrd: '987654321' } })
      .expect('Content-Type', /json/)
      .expect({ error: 'Unauthorized' })
      .expect(401, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .post('/users/5dbff32e367a343830cd2f49/5dbff32e367a343830cd2f47')
      .expect('Content-Type', /json/)
      .expect({ error: 'Forbidden' })
      .expect(403, done);
  });

  test('User wil not be added if they are already in the chat', (done) => {
    bcrypt.compare = jest.fn()
      .mockResolvedValue(true);

    const user = {
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: ['5dbff32e367a343830cd2f47'],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/users/5dbff32e367a343830cd2f49/5dbff32e367a343830cd2f47')
      .set({ Authorization: `Bearer ${token}` })
      .send({ body: { password: '123456789' } })
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  test('happy', (done) => {
    bcrypt.compare = jest.fn()
      .mockResolvedValue(true);

    const user = {
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/users/5dbff32e367a343830cd2f49/5dbff32e367a343830cd2f47')
      .set({ Authorization: `Bearer ${token}` })
      .send({ body: { password: '123456789' } })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
