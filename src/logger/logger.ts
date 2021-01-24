import winston, { format, transports } from 'winston';
import { PROD } from '../constants';

function getLoggingLevel() {
  if (PROD) {
    return 'info';
  }
  return 'debug';
}

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: getLoggingLevel(),
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'add-me-to' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
})

export default logger;
