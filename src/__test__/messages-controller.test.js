/* *
*@jest-environment node
*/
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const messages = require('../../routes/messages');

const User = require('../../models/users');
const Message = require('../../models/messages');
const Chatroom = require('../../models/chatroom');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/messages', messages);

describe('messages get', () => {
  beforeAll(() => {
    Message.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      title: 'title',
      content: 'message content',
      username: ' username0',
      timestamp: 4566521586,
      roomID: '5dbff32e367a343830cd2f49'
    }]);

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      roomName: 'room name',
      password: '123456789',
      isPublic: false,
    });
  });

  describe('All messages', () => {
    test('Forbidden if not admin', (done) => {
      const user = {
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: [],
      };

      const token = jwt.sign(user, process.env.JWT_SECRET);

      request(app)
        .get('/messages/')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect({ error: 'You need to be an admin or a member of any servers you are trying to read.' })
        .expect(403, done);
    });

    test('Forbidden if no jwt', (done) => {
      request(app)
        .get('/messages/')
        .expect('Content-Type', /json/)
        .expect({ error: 'You are not signed in.' })
        .expect(403, done);
    });

    test('Ok if happy', (done) => {
      const user = {
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: true,
        chatrooms: [],
      };

      const token = jwt.sign(user, process.env.JWT_SECRET);

      request(app)
        .get('/messages/')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('Per Chatroom', () => {
    test('Forbidden if neither admin nor user of that server', (done) => {
      const user = {
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: [],
      };

      const token = jwt.sign(user, process.env.JWT_SECRET);

      request(app)
        .get('/messages/chatroom/5dbff32e367a343830cd2f49')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect({ error: 'You need to be an admin or a member of any servers you are trying to read.' })
        .expect(403, done);
    });

    test('Forbidden if no jwt', (done) => {
      request(app)
        .get('/messages/chatroom/5dbff32e367a343830cd2f49')
        .expect('Content-Type', /json/)
        .expect({ error: 'You are not signed in.' })
        .expect(403, done);
    });

    test('Ok if user is admin', (done) => {
      const user = {
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: true,
        chatrooms: [],
      };

      const token = jwt.sign(user, process.env.JWT_SECRET);

      request(app)
        .get('/messages/chatroom/5dbff32e367a343830cd2f49')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    test('Ok if user belongs to the server but not admin', (done) => {
      const user = {
        first_name: 'myname',
        last_name: 'mylastname',
        username: ' username0',
        password: '123456789',
        isAdmin: false,
        chatrooms: ['5dbff32e367a343830cd2f49'],
      };

      const token = jwt.sign(user, process.env.JWT_SECRET);

      request(app)
        .get('/messages/chatroom/5dbff32e367a343830cd2f49')
        .set({ Authorization: `Bearer ${token}` })
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

describe('One message get', () => {
  beforeAll(() => {
    Message.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f49',
      title: 'title',
      content: 'message content',
      username: 'objectId',
      timestamp: 4566521586,
      roomID: '5dbff32e367a343830cd2f49',
    });

    Chatroom.findById = jest.fn().mockResolvedValue({
      _id: '5dbff32e367a343830cd2f48',
      roomName: 'room name',
      password: '123456789',
      isPublic: false,
    });
  });

  test('Forbidden error if not admin or user who sent message', (done) => {
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
      .get('/messages/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect({ error: 'You need to be an admin or a member of any servers you are trying to read.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .get('/messages/5dbff32e367a343830cd2f49')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('Ok if user is admin', (done) => {
    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);
    request(app)
      .get('/messages/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  test('Ok if message belongs to the user but not admin', (done) => {
    const user = {
      _id: 'objectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: 'username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: ['5dbff32e367a343830cd2f49'],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .get('/messages/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('User messages get', () => {
  beforeAll(() => {
    Message.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      title: 'title',
      content: 'message content',
      username: 'objectId',
      timestamp: 4566521586,
      roomID: '5dbff32e367a343830cd2f49',
    }]);
  });

  test('forbidden if neither admin nor self', (done) => {
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
      .get('/messages/user/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect({ error: 'You need to be an admin or the user who\'s message you are trying to get.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .get('/messages/user/5dbff32e367a343830cd2f49')
      .expect('Content-Type', /json/)
      .expect({ error: 'You are not signed in.' })
      .expect(403, done);
  });

  test('Ok if admin', (done) => {
    const user = {
      _id: '5dbff32e367a343830cd2f49',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: ['5dbff32e367a343830cd2f47'],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .get('/messages/user/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  test('Ok if user is getting own messages', (done) => {
    const user = {
      _id: 'objectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .get('/messages/user/objectId')
      .set({ Authorization: `Bearer ${token}` })
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('Edit message put', () => {
  test('Forbidden error if not the user who sent message', (done) => {
    const user = {
      _id: 'userObjectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    jest.spyOn(Message, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            title: 'title',
            content: 'message content22',
            username: {
              _id: 'differentUserObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
            timestamp: 4566521586,
            roomId: '4dbff32e367a343830cd2f47',
          }),
        }),
      }));

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/messages/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect({ error: 'You need to be the user who sent the message you are trying to edit.' })
      .send({
        content: 'new message',
      })
      .expect(403, done);
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

    jest.spyOn(Message, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            title: 'title',
            content: 'message content22',
            username: {
              _id: 'userObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
            timestamp: 4566521586,
            roomId: '4dbff32e367a343830cd2f47',
          }),
        }),
      }));

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/messages/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        content: 'message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.',
      })
      .expect(400, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .put('/messages/edit/5dbff32e367a343830cd2f49')
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
    Message.findById.prototype.populate = jest.fn();

    jest.spyOn(Message, 'findById')
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockReturnValue({
            _id: 'messageObjectId',
            title: 'title',
            content: 'message content22',
            username: {
              _id: 'userObjectId',
              first_name: 'myname',
              last_name: 'mylastname',
              username: 'username0',
              password: '123456789',
              isAdmin: false,
              chatrooms: [],
            },
            timestamp: 4566521586,
            roomId: '4dbff32e367a343830cd2f47',
          }),
        }),
      }));

    jest.spyOn(Message.prototype, 'save')
      .mockImplementation({
        apply: () => true,
      });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .put('/messages/edit/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        content: 'message must be less than 300 characters long.',
      })
      .expect(200, done);
  });
});

describe('delete message', () => {
  beforeAll(() => {
    Message.find = jest.fn().mockResolvedValue([{
      _id: '5dbff32e367a343830cd2f49',
      title: 'title',
      content: 'message content',
      username: 'objectId',
      timestamp: 4566521586,
      roomId: '4dbff32e367a343830cd2f47',
    }]);

    Message.findById = jest.fn().mockResolvedValue({
      _id: 'messageObjectId',
      title: 'title',
      content: 'message content',
      username: 'objectId',
      timestamp: 4566521586,
      roomId: '4dbff32e367a343830cd2f47',
    });

    Message.findByIdAndRemove = jest.fn();
  });

  test('Forbidden error if not the user who sent message', (done) => {
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
      .delete('/messages/delete/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect({ error: 'You need to be the user who sent the message you are trying to delete.' })
      .expect(403, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .delete('/messages/delete/5dbff32e367a343830cd2f49')
      .expect('Content-Type', /json/)
      .expect(403, done);
  });

  test('Happy if sender', (done) => {
    const user = {
      _id: 'objectId',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: false,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .delete('/messages/delete/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect(200, done);
  });

  test('Happy if admin', (done) => {
    const user = {
      _id: 'object',
      first_name: 'myname',
      last_name: 'mylastname',
      username: ' username0',
      password: '123456789',
      isAdmin: true,
      chatrooms: [],
    };

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .delete('/messages/delete/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .expect(200, done);
  });
});

describe('Post Message', () => {
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
      .post('/messages/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        content: 'message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.message must be less than 300 characters long.',
      })
      .expect(400, done);
  });

  test('Forbidden if no jwt', (done) => {
    request(app)
      .post('/messages/5dbff32e367a343830cd2f49')
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

    jest.spyOn(Message.prototype, 'save')
      .mockImplementation({
        apply: () => true,
      });

    const token = jwt.sign(user, process.env.JWT_SECRET);

    request(app)
      .post('/messages/5dbff32e367a343830cd2f49')
      .set({ Authorization: `Bearer ${token}` })
      .type('form')
      .send({
        content: 'message must be less than 300 characters long.',
      })
      .expect(200, done);
  });
});
