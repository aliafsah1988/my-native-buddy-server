/* eslint-disable */
import winston from'winston';
import fs from'fs';
import path from'path';
const logDir = 'logs';
var debug = typeof v8debug === 'object' ||
  /--debug|--inspect/.test(process.execArgv.join(' '));

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

var options = {
  file: {
    level: 'info',
    filename: path.join(logDir, '/-results.log'),
    //TODO check how winston handles excptions
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    // new(require('winston-daily-rotate-file'))(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

let stream = {
  write: function (message, encoding) {
    logger.info(message);
  }
};

const logger = {
  // winstonLogger: this.winstonLogger,
  log_info(input) {
    winstonLogger.info(input);
    if (debug)
      winstonLogger.debug(input);
  },
  log_error(input) {
    winstonLogger.error(input);
    if (debug)
      winstonLogger.debug("error: " + input);
  },
  stream: stream,
};

export default logger;