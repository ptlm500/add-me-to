/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger, QueryRunner } from "typeorm";
import logger from './logger';

export default class TypeOrmLogger implements Logger {

  log(level: 'log' | 'info' | 'warn', message: unknown, _queryRunner?: QueryRunner): void {
    if (level === 'log' || level === 'info') {
      logger.info(message);
    } else if (level === 'warn') {
      logger.warning(message);
    }
  }

  logMigration(message: string, _queryRunner?: QueryRunner): void {
    logger.info(message);
  }

  logQuery(query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void {
    logger.debug(query, {query, parameters});
  }

  logQueryError(error: string, query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void {
    logger.error(error, { query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], _queryRunner?: QueryRunner): void {
    logger.warning('⏱ Slow query', { time, query, parameters });
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner): void {
    logger.info(message);
  }
}