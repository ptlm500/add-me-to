import { REST } from "@discordjs/rest";
import logger from '../logger/logger';

if (!process.env.DISCORD_TOKEN) {
  const errorMessage = 'DISCORD_TOKEN not set.';
  logger.error(`❗ ${errorMessage}`);
  throw new Error(errorMessage);
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

export default rest;
