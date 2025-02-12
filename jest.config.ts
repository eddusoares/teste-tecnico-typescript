import {Config} from 'jest'

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  rootDir: ".",
} as Config
