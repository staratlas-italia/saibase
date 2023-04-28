/* eslint-disable @typescript-eslint/no-explicit-any */

const createMessageInfo = (name: string) =>
  `[${name}][${new Date().toISOString()}]`;

export const createLogger = (name: string) => ({
  log: (message?: any, ...optionalParams: any[]) => {
    console.log(createMessageInfo(name), message, ...optionalParams);
  },
  debug: (message?: any, ...optionalParams: any[]) => {
    console.debug(createMessageInfo(name), message, ...optionalParams);
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    console.warn(createMessageInfo(name), message, ...optionalParams);
  },
  error: (message?: any, ...optionalParams: any[]) => {
    console.error(createMessageInfo(name), message, ...optionalParams);
  },
  info: (message?: any, ...optionalParams: any[]) => {
    console.info(createMessageInfo(name), message, ...optionalParams);
  },
});

export type Logger = ReturnType<typeof createLogger>;
