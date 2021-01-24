require('dotenv').config();
import { Message } from "discord.js";
// import ormconfig from "./ormconfig";
import {
  createConnection,
  getConnectionOptions
} from "typeorm";
import Discord from "discord.js";
import { events } from "./config.json";
import { Server } from "./entities";
import commands, { addRoles } from './commands';
import CommandHandler from "./command-handler/CommandHandler";
import logger from './logger/logger';

const client = new Discord.Client();
const commandHandler = new CommandHandler(commands, addRoles);

const main = async () => {
  logger.notice('⌛ Initializing ORM');
  const connectionOptions = await getConnectionOptions();
  await createConnection(connectionOptions);
  logger.notice('✅ ORM initialised');

  logger.notice('⌛ Connecting Discord client');
  client.login(process.env.DISCORD_TOKEN);
};

main().catch(err => {
  logger.error(err);
});

client.on(events.ready, () => {
  if (client.user) {
    logger.notice(`🚀 Logged in as ${client.user.tag}`);
  } else {
    logger.warning('🚀 Logged in as unknown user', { client });
  }
});

client.on("guildCreate", async (guild) => {
  logger.notice(`👋 Added to server ${guild.name}:${guild.id}`);
  await Server.create({
    discordId: guild.id,
    name: guild.name
  }).save();
  logger.notice(`💾 Server records created ${guild.name}:${guild.id}`);
});

// Update name on guild update

client.on(events.message, async (userMessage: Message) => {
  if (userMessage.author.bot) {
    return;
  }
  if (client.user && userMessage.mentions.has(client.user.id)) {
    if (userMessage.author.id === process.env.ADMIN_ID) {
      const command = userMessage.content.split(' ')
        .filter(commandPart => !userMessage.mentions.has(getIdFromMention(commandPart)))
        .join(' ');

      logger.info('Processing command', {
        server: userMessage.guild?.id,
        user: userMessage.author,
        command
      });
      commandHandler.onMessage(command, userMessage);
    }
  }
});

function getIdFromMention(mention: string) {
  if (!mention) return '';

  if (mention.startsWith('<@') && mention.endsWith('>')) {
    mention = mention.slice(2, -1);

    if (mention.startsWith('!') || mention.startsWith('&')) {
      mention = mention.slice(1);
    }
  }
  return mention;
}

client.on(events.error, error => {
  logger.error(error);
});
