/* *
*@jest-environment node
*/
// @ts-nocheck
import * as utils from '../../utility-functions/post-fetch';

describe('Post fetch Create chat.', () => {
  test('Create chat navigates to chatrooms on good response', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 200, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateChat,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(navigate).toBeCalledWith('/members-chat/chatrooms');
  });

  test('Adds errors sent from the server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateChat,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch sign Up', () => {
  test('Submit Post navigates to home on good response', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 200, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateSignUp,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(navigate).toBeCalledWith('/members-chat/');
  });

  test('Sets wrong username or password message on 401 error. ', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 401, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateSignUp,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Username or password are invalid.');
  });

  test('Adds errors sent from server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateSignUp,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch log in', () => { // TODO: add happy path for this and sign up.
  test('Sets wrong username or password message on 401 error. ', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 401, json: jest.fn(() => 'works') },
    ));

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const setHasAuth = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateLogIn,
      setValidationError,
      navigate,
      setHasAuth,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Wrong username or password.');
  });

  test('Adds error from server errors', async () => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };

    global.localStorage = localStorageMock as unknown as Storage;

    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({
        error: 'Something went wrong. Please try again.',
      })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const setHasAuth = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateLogIn,
      setValidationError,
      navigate,
      setHasAuth,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch Make Admin.', () => {
  test('Happy path.', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        json: jest.fn(() => ({ token: 'token' })),
      },
    ));

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateMakeAdmin,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(localStorageMock.setItem).toBeCalledWith('jwt', 'token');
  });

  test('Adds errors sent from the server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateMakeAdmin,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch Leave Chatroom.', () => {
  test('Happy path.', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        json: jest.fn(() => ({ token: 'token' })),
      },
    ));

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateLeaveChatroom,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(localStorageMock.setItem).toBeCalledWith('jwt', 'token');
  });

  test('Adds errors sent from the server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateLeaveChatroom,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch Join Chatroom.', () => {
  test('Happy path.', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        json: jest.fn(() => ({ token: 'token' })),
      },
    ));

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateJoinChatroom,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(localStorageMock.setItem).toBeCalledWith('jwt', 'token');
  });

  test('Adds errors sent from the server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateJoinChatroom,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch Create/Delete message', () => {
  test('Happy path.', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        json: jest.fn(() => ({ message: 'message' })),
      },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateDeleteMessage,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    const jsonResponse = { message: 'message' };

    expect(sendMessage).toBeCalledWith(JSON.stringify(jsonResponse));
  });

  test('Adds errors sent from the server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateDeleteMessage,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch edit Message.', () => {
  test('Happy path.', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      {
        status: 200,
        json: jest.fn(() => ({ message: 'message' })),
      },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateMessageEdit,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    const jsonResponse = { message: 'message' };

    expect(sendMessage).toBeCalledWith(JSON.stringify(jsonResponse));
  });

  test('Adds errors sent from the server.', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      status: 403,
      json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
    }));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const sendMessage = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateMessageEdit,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});
