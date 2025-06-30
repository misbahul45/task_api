import { createLogger, format, transports } from 'winston';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const customLogger = createLogger({
  levels: logLevels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata(),
    format.json(),
    format.errors({ stack: true }),
  ),
  defaultMeta: {
    service: 'my-app',
    logId: () => uuidv4(),
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, metadata }) => {
          return `[${timestamp}] ${level}: ${message} ${JSON.stringify(metadata)}`;
        }),
      ),
    }),
    new transports.File({
      filename: join(__dirname, '..', 'logs', 'app.log'),
      maxsize: 5242880,
      maxFiles: 5,
      tailable: true,
    }),
    new transports.File({
      filename: join(__dirname, '..', 'logs', 'error.log'),
      level: 'error',
    }),
  ],
});

export const log = (message: string, ...rest: any[]) => {
  const metadata = rest.length > 0 ? { additional: rest } : {};
  customLogger.info(message, metadata);
};

export const customLoggerMethods = {
  error: (message: string, ...rest: any[]) => {
    const metadata = rest.length > 0 ? { additional: rest } : {};
    customLogger.error(message, metadata);
  },
  warn: (message: string, ...rest: any[]) => {
    const metadata = rest.length > 0 ? { additional: rest } : {};
    customLogger.warn(message, metadata);
  },
  info: (message: string, ...rest: any[]) => {
    const metadata = rest.length > 0 ? { additional: rest } : {};
    customLogger.info(message, metadata);
  },
  debug: (message: string, ...rest: any[]) => {
    const metadata = rest.length > 0 ? { additional: rest } : {};
    customLogger.debug(message, metadata);
  },
};

export class AppError extends Error {
  status: number
  details?: any

  constructor(message: string, status = 500, details?: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

export default customLogger;