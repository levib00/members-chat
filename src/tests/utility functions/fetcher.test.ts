/* *
*@jest-environment node
*/
// @ts-nocheck
import * as utils from "../../../client/src/utility-functions/fetcher";

describe("Fetchers are called right", () => {

  test('getFetcher is called with correct params', async() => {
    global.fetch = jest.fn(() =>
    Promise.resolve(
      {status: 200, json: jest.fn(() => 'works')})
    );

    const getResponse = await utils.getFetcher('localhost:3000');

    expect(getResponse).toBe('works')
    
  });
})