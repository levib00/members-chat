export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  // process `*.tsx` files with `ts-jest`
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['dist/'],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
  },
  globals: {
    fetch: global.fetch,
    localStorage: global.localStorage,
  },
  setupFiles: ['jest-localstorage-mock'],
};
