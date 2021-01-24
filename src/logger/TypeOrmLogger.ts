import { Logger, QueryRunner } from "typeorm";
import logger from './logger';

export default class TypeOrmLogger implements Logger {

  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner): any {
    if (level === 'log' || level === 'info') {
      logger.info(message);
    } else if (level === 'warn') {
      logger.warning(message);
    }
  }

  logMigration(message: string, _queryRunner?: QueryRunner): any {
    logger.info(message);
  }

  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    logger.debug(query, {query, parameters});
  }

  logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    logger.error(error, { query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    logger.warning('Slow query', { time, query, parameters });
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner): any {
    logger.info(message);
  }
}