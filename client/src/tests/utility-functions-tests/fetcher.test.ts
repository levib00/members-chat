// @ts-nocheck
import * as utils from '../../utility-functions/fetcher';

describe('Fetchers are called right', () => {
  test('getFetcher is called with correct params', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, json: jest.fn(() => 'works') }));

    const getResponse = await utils.getFetcher('localhost:3000');

    expect(getResponse).toBe('works');
  });

  test('getFetcher is called with correct params', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('error')));

    expect(() => utils.getFetcher('localhost:3000')).rejects.toThrowError();
  });
});
