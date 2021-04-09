// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import {
  createConnection,
  getConnectionOptions,
} from "typeorm";
import logger from './logger/logger';
import TypeOrmLogger from './logger/TypeOrmLogger';
import discordClient from './clients/discordClient';

const typeOrmLogger = new TypeOrmLogger();

const main = async () => {
  logger.notice('⌛ Initializing ORM');
  const connectionOptions = await getConnectionOptions();
  await createConnection({
    ...connectionOptions,
    logger: typeOrmLogger
  });
  logger.notice('✅ ORM initialised');

  logger.notice('⌛ Connecting Discord client');
  discordClient.login(process.env.DISCORD_TOKEN);
};

main().catch(err => {
  logger.error(err);
});
