import * as winston from 'winston';

declare module 'winston' {
  export interface Logger {
    unexpected: winston.LeveledLogMethod;
    serverError: winston.LeveledLogMethod;
  }
}
