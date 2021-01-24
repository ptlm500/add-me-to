import winston, { format } from 'winston';
import DiscordTransport from 'winston-discord-transport';
import { PROD } from '../constants';

function getLoggingLevel() {
  if (PROD) {
    return 'info';
  }
  return 'debug';
}

const defaultMeta = { service: 'add-me-to' };

const transports : winston.transport[] = [
  new winston.transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  })
];

if (process.env.DISCORD_ERROR_WEBHOOK) {
  transports.push(new DiscordTransport({
    webhook: process.env.DISCORD_ERROR_WEBHOOK,
    defaultMeta,
    level: 'error'
  }));
}

if (process.env.DISCORD_NOITCE_WEBHOOK) {
  transports.push(new DiscordTransport({
    webhook: process.env.DISCORD_NOITCE_WEBHOOK,
    defaultMeta,
    level: 'notice'
  }));
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
  transports
});

export default logger;
