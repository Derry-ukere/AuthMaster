module.exports = {
  testRegex: './src/tests/.*\\.spec\\.ts',
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  // TS takes precedence as we want to avoid build artifacts from being required instead of up-to-date .ts file.
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/migrations/**',
    '!src/**/models/**/*',
    '!src/**/interfaces/**/*',
    '!src/**/app.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!node_modules/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleNameMapper: {
    '@constants(.*)$': '<rootDir>/src/constants$1',
    '@handlers(.*)$': '<rootDir>/src/handlers$1',
    '@helpers(.*)$': '<rootDir>/src/helpers$1',
    '@interfaces(.*)$': '<rootDir>/src/interfaces$1',
    '@middlewares(.*)$': '<rootDir>/src/middlewares$1',
    '@migrations(.*)$': '<rootDir>/src/migrations$1',
    '@modules(.*)$': '<rootDir>/src/modules$1',
    '@typings(.*)$': '<rootDir>/src/typings$1',
    '@utils(.*)$': '<rootDir>/src/utils$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
