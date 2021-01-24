import pino from 'pino';

const pinoLogger = pino({
  name: 'app-name',
  level: 'debug',
});

export { pinoLogger };
