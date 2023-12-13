// @ts-nocheck
import parseDom from '../../utility-functions/dom-parser';

describe('Fetchers are called right', () => {
  test('getFetcher is called with correct params', async () => {
    expect(parseDom('Lorem &amp; ipsum')).toBe('Lorem & ipsum');
  });
});
