/* *
*@jest-environment node
*/
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const messages = require('../chatrooms');

const User = require('../../models/users');
const Message = require('../../models/messages');
const Chatroom = require('../../models/chatroom');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/chatrooms', messages);

describe('Chatroom get', () => {
  beforeAll(() => {
    Chatroom.find = jest.fn().mockResolvedValue([{
      roomName: 'name',
      isPublic: true,
      password: '1234',
      createdBy: { user: 'user' },
    },
    {
      roomName: 'name2',
      isPublic: false,
      password: '43132',
      createdBy: { user: 'user2' },
    }]);

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f48',
      roomName: 'room name',
      password: '123456789',
      isPublic: false,
    });
  });

  describe('Get all chatrooms', () => {
    test('Ok if happy', (done) => {
      request(app)
        .get('/chatrooms/')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('One chatroom', () => {
    test('Ok if user is admin', (done) => {
      request(app)
        .get('/chatrooms/chatroomId')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

describe('Create new chat', () => {
  beforeAll(() => {
    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      roomName: 'room name',
      password: '123456789',
      isPublic: false,
    });

    User.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatroom: [],
    });
  });

  test('Form validation error', (done) => {
    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/chatrooms/new')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        roomName: 'message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.',
        isPublic: true,
        password: 'password1234',
      })
      .expect(400, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .post('/chatrooms/new')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('Happy', (done) => {
    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    jest.spyOn(Chatroom.prototype, 'save')
      .mockImplementation({
        apply: () => true,
      });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/chatrooms/new')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        roomName: 'message must be less than 300 characters long.',
        password: 'password1234',
        isPublic: true,
      })
      .expect(200, done);
  });
});

describe('Delete Chatroom', () => {
  beforeAll(() => {
    Chatroom.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      roomName: 'message must be less than 300 characters long.',
      password: 'password1234',
      isPublic: true,
    }]);

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f48',
      roomName: 'room name',
      password: '123456789',
      isPublic: false,
      createdBy: {
        _id: '5dbff32e367a343830cd2f49',
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: [],
      },
    });

    Message.findByIdAndRemove = jest.fn();
  });

  test('Forbidden error if not the user who created the server', (done) => {
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
      .delete('/chatrooms/delete/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect({ error: 'You need to be the user who sent the message you are trying to delete.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .delete('/chatrooms/delete/5dbff32e367a343830cd2f49')
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  test('Happy if user that created chatroom', (done) => {
    const user = {
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    Chatroom.findByIdAndRemove = jest.fn().mockResolvedValueOnce(true)

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .delete('/chatrooms/delete/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect(200, done);
  });

  test('Happy if user is admin', (done) => {
    const user = {
      _id: '5dbff32e367a343830cd2f39',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    };

    Chatroom.findByIdAndRemove = jest.fn().mockResolvedValueOnce(true)

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .delete('/chatrooms/delete/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect(200, done);
  });
});

describe('Edit chatroom put', () => {
  test('Forbidden error if not the user who created the chatroom', (done) => {
    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    jest.spyOn(Chatroom, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            roomName: 'message must be less than 300 characters long.',
            password: 'password1234',
            isPublic: true,
            createdBy: {
              _id: 'differentUserObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
          }),
        }),
      }));

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/chatrooms/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect({ error: 'You need to be the user who created the chatroom you are trying to edit.' })
      .send({
        roomName: 'new name',
        isPublic: false,
        password: 'newpass',
      })
      .expect(403, done);
  });

  test('Form validation error', (done) => {
    const user = {
      _id: 'differentUserObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    jest.spyOn(Chatroom, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            roomName: 'message must be less than 300 characters long.',
            password: 'password1234',
            isPublic: true,
            createdBy: {
              _id: 'differentUserObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
          }),
        }),
      }));

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/chatrooms/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        roomName: 'new namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew namenew name',
        isPublic: false,
        password: 'newpass',
      })
      .expect(400, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .put('/chatrooms/edit/5dbff32e367a343830cd2f49')
      .send({
        roomName: 'new name',
        isPublic: false,
        password: 'newpass',
      })
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('Happy if user that created chatroom', (done) => {
    const user = {
      _id: 'differentUserObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    jest.spyOn(Chatroom, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            roomName: 'message must be less than 300 characters long.',
            password: 'password1234',
            isPublic: true,
            createdBy: {
              _id: 'differentUserObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
          }),
        }),
      }));

    jest.spyOn(Message.prototype, 'save')
      .mockImplementation({
        apply: () => true,
      });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/chatrooms/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        roomName: 'new name',
        isPublic: false,
        password: 'newpass',
      })
      .expect(200, done);
  });

  test('Happy if user is admin.', (done) => {
    const user = {
      _id: 'UserObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    };

    jest.spyOn(Chatroom, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            roomName: 'message must be less than 300 characters long.',
            password: 'password1234',
            isPublic: true,
            createdBy: {
              _id: 'differentUserObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
          }),
        }),
      }));

    jest.spyOn(Message.prototype, 'save')
      .mockImplementation({
        apply: () => true,
      });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/chatrooms/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        roomName: 'new name',
        isPublic: false,
        password: 'newpass',
      })
      .expect(200, done);
  });
});
