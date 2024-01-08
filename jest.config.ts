import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleFileExtensions: [
    "js","ts","json",
  ],
  preset: 'ts-jest',
  // reporters: [
  //   '<rootDir>/test/_cfg/test.reporter.js'
  // ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: "node",
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

export default config;
