/* *
*@jest-environment node
*/
// @ts-nocheck
import * as utils from '../../utility-functions/post-fetch';

describe('Post fetch', () => {
  test('Create chat navigates to chatrooms on good response', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 200, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateChat,
      setError,
      setValidationError,
      navigate,
      null,
    );

    expect(navigate).toBeCalledWith('/chatrooms');
  });

  test('Sets wrong username or password message on 401 error. ', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 401, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateChat,
      setError,
      setValidationError,
      navigate,
      null,
    );

    expect(setValidationError).toBeCalledWith('Chat name or password are invalid.');
  });

  test('Adds something went wrong on unexpected errors', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 403, json: jest.fn(() => 'works') },
    ));

    global.fetch = jest.fn(() => Promise.resolve(
      { status: 403, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateCreateChat,
      setError,
      setValidationError,
      navigate,
      null,
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
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateSignUp,
      setError,
      setValidationError,
      navigate,
      null,
    );

    expect(navigate).toBeCalledWith('/');
  });

  test('Sets wrong username or password message on 401 error. ', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 401, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateSignUp,
      setError,
      setValidationError,
      navigate,
      null,
    );

    expect(setValidationError).toBeCalledWith('Username or password are invalid.');
  });

  test('Adds something went wrong on unexpected errors', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 403, json: jest.fn(() => 'works') },
    ));

    global.fetch = jest.fn(() => Promise.resolve(
      { status: 403, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateSignUp,
      setError,
      setValidationError,
      navigate,
      null,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});

describe('Post fetch log in', () => {
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
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const setHasAuth = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateLogIn,
      setError,
      setValidationError,
      navigate,
      setHasAuth,
    );

    expect(setValidationError).toBeCalledWith('Wrong username or password.');
  });

  test('Adds something went wrong on unexpected errors', async () => {
    global.fetch = jest.fn(() => Promise.resolve(
      { status: 403, json: jest.fn(() => 'works') },
    ));

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as unknown as Storage;

    global.fetch = jest.fn(() => Promise.resolve(
      { status: 403, json: jest.fn(() => 'works') },
    ));

    const url = 'localhost:8000';
    const e = { preventDefault: jest.fn() };
    const setError = jest.fn();
    const setValidationError = jest.fn();
    const navigate = jest.fn();
    const setHasAuth = jest.fn();
    const mockBody = { one: '', two: '', three: '' };

    await utils.submitPost(
      url,
      mockBody,
      e,
      utils.validateLogIn,
      setError,
      setValidationError,
      navigate,
      setHasAuth,
    );

    expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
  });
});
