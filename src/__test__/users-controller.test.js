/* *
*@jest-environment node
*/
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = require('../../routes/users');

const User = require('../../models/users');
const Chatroom = require('../../models/chatroom');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/users', users);

test('sign up checks for wrong passwords', (done) => {
  User.exists = jest.fn().mockReturnValue(false);
  request(app)
    .post('/users/sign-up')
    .type('form')
    .send({
      firstName: 'myname',
      lastName: 'mylastname',
      username: ' username0',
      password: '123456789',
      passwordConfirmation: '987654321',
    })
    .expect({ error: 'Passwords do not match.' })
    .expect(403, done);
});

describe('Make user admin put', () => { // TODO: fix
  beforeEach(() => {
    User.findByIdAndUpdate = jest.fn();
  });

  test('Forbidden error if user sending request is not admin.', (done) => {
    User.findById = jest.fn()
      .mockResolvedValueOnce({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: [],
      })
      .mockResolvedValueOnce({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: [],
      });
    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/users/admin/123456789011')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect({ error: 'You need to be an admin to make another user an admin.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .put('/users/admin/123456789011')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('Forbidden if user being made admin is already admin.', (done) => {
    User.findById = jest.fn()
      .mockResolvedValueOnce({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: true,
        chatrooms: [],
      })
      .mockResolvedValueOnce({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: true,
        chatrooms: [],
      });

    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/users/admin/123456789011')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect({ error: 'This user is already an admin.' })
      .expect(403, done);
  });

  test('Happy', (done) => {
    User.findById = jest.fn()
      .mockResolvedValueOnce({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: [],
      })
      .mockResolvedValueOnce({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: true,
        chatrooms: [],
      });

    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/users/admin/123456789011')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect(200, done);
  });
});

describe('All users get', () => {
  beforeEach(() => {
    jest.spyOn(User, 'find')
      .mockImplementation(() => ({
        select: jest.fn().mockReturnValue(
          [{
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
          }],
        ),
      }));

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    });
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

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .get('/users/')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect({ error: 'You must be an admin to see all users.' })
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
  beforeEach(() => {
    User.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    }]);

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    });

    User.findByIdAndUpdate = jest.fn();

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f47',
      roomName: 'myname',
      password: '123456789',
      isPublic: false,
    });
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
      .post('/users/join/656af04329493482a71f9df1')
      .set({ Authorization: `Bearer ${token}` })
      .send({ body: { passowrd: '987654321' } })
      .expect('Content-Type', /json/)
      .expect({ error: 'Incorrect password' })
      .expect(401, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .post('/users/join/656af04329493482a71f9df1')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('User wil not be added if they are already in the chat', (done) => {
    bcrypt.compare = jest.fn()
      .mockResolvedValue(true);

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: ['5dbff32e367a343830cd2f47'],
    });

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f47',
      roomName: 'myname',
      password: '123456789',
      isPublic: false,
    });

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
      .post('/users/join/656af04329493482a71f9df1')
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
      .post('/users/join/656af04329493482a71f9df1')
      .set({ Authorization: `Bearer ${token}` })
      .send({ body: { password: '123456789' } })
      // .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('Get other user', () => {
  beforeEach(() => {
    jest.spyOn(User, 'findById')
      .mockImplementation(() => ({
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: true,
        chatroom: [],
        select: jest.fn().mockReturnValue({
          _id: '5dbff32e367a343830cd2f49',
          first_name: 'myname',
          last_name: 'mylastname',
          username: ' username0',
          password: '123456789',
          isAdmin: false,
          chatroom: [],
          select: jest.fn().mockReturnValue({
            _id: '5dbff32e367a343830cd2f49',
            first_name: 'myname',
            last_name: 'mylastname',
            username: ' username0',
            password: '123456789',
            isAdmin: false,
            chatroom: [],
            select: jest.fn().mockReturnValue({
              _id: '5dbff32e367a343830cd2f49',
              first_name: 'myname',
              last_name: 'mylastname',
              username: ' username0',
              password: '123456789',
              isAdmin: false,
              chatroom: [],
            }),
          }),
        }),
      }));
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

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .get('/users/user/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect({ error: 'You must be an admin to get the info of another user.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .get('/users/user/5dbff32e367a343830cd2f49')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
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
      .get('/users/user/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('Leave chat room', () => {
  beforeEach(() => {
    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    });
  });

  test('Returns forbidden if user is not in the chatroom they are trying to leave.', (done) => {
    const user = {
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatroom: [],
    };

    User.findByIdAndUpdate = jest.fn();

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/users/leave/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not in the chatroom you\'re trying to leave.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .post('/users/leave/5dbff32e367a343830cd2f49')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('Happy', (done) => {
    const user = {
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatroom: [],
    };

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: ['5dbff32e367a343830cd2f49'],
    });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/users/leave/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
