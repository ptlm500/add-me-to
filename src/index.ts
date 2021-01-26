require('dotenv').config();
import { Guild, Message, Role } from "discord.js";
import {
  createConnection,
  getConnectionOptions,
  getCustomRepository
} from "typeorm";
import Discord from "discord.js";
import { Server } from "./entities";
import commands, { addRoles } from './commands';
import CommandHandler from "./command-handler/CommandHandler";
import logger from './logger/logger';
import TypeOrmLogger from './logger/TypeOrmLogger';

import ServerRepository from "./repositories/ServerRepository";

const typeOrmLogger = new TypeOrmLogger();
const client = new Discord.Client();
const commandHandler = new CommandHandler(commands, addRoles);

const main = async () => {
  logger.notice('⌛ Initializing ORM');
  const connectionOptions = await getConnectionOptions();
  await createConnection({
    ...connectionOptions,
    logger: typeOrmLogger
  });
  logger.notice('✅ ORM initialised');

  logger.notice('⌛ Connecting Discord client');
  client.login(process.env.DISCORD_TOKEN);
};

main().catch(err => {
  logger.error(err);
});

client.on("ready", () => {
  if (client.user) {
    logger.notice(`🚀 Logged in as ${client.user.tag}`);
  } else {
    logger.warning('🚀 Logged in as unknown user', { client });
  }
  logger.notice(`🌍 Online and serving ${client.guilds.cache.size} servers`);
  client.user?.setActivity('@add me to @role');
});

client.on("guildCreate", async (guild) => {
  logger.notice(`👋 Added to server ${guild.name}:${guild.id}`, {
    meta: {
      serverId: guild.id,
    }
  });
  Server.create({
    discordId: guild.id,
    name: guild.name
  }).save().then(() => {
    logger.notice(`💾 Server records created ${guild.name}:${guild.id}`, {
      meta: {
        serverId: guild.id,
      }
    });
  })
});

client.on("guildDelete", async (guild) => {
  logger.notice(`😥 Removed from server ${guild.name}:${guild.id}`, {
    meta: {
      serverId: guild.id,
    }
  });
  const serverRepository = getCustomRepository(ServerRepository);
  serverRepository.delete(guild.id).then(() => {
    logger.notice(`🗑 Server records removed ${guild.name}:${guild.id}`, {
      meta: {
        serverId: guild.id,
      }
    });
  });
});

client.on("guildUpdate", async (oldGuild: Guild, newGuild: Guild) => {
  if (oldGuild.name !== newGuild.name) {
    logger.info('Guild name updated', {
      meta: {
        serverId: newGuild.id,
      },
    });

    const serverRepository = getCustomRepository(ServerRepository);
    const updatedServer = await serverRepository.updateServerName(newGuild.id, newGuild.name);
    if (updatedServer) {
      logger.notice('Guild name update written', {
        meta: {
          serverId: newGuild.id,
          oldName: oldGuild.name,
          newName: updatedServer.name
        }
      });
    }
  }
});

client.on("roleDelete", async (deletedRole: Role) => {
  const guild = deletedRole.guild;
  const serverRepository = getCustomRepository(ServerRepository);
  const updatedServer = await serverRepository.deleteRole(guild.id, deletedRole);
  if (updatedServer) {
    logger.notice(`🗑 Deleted role ${deletedRole.name}:${deletedRole.id}`, {
      meta: {
        serverId: guild.id
      },
      deletedRole
    });
  }
});

client.on("message", async (userMessage: Message) => {
  if (userMessage.author.bot) {
    return;
  }
  if (client.user && userMessage.mentions.has(client.user.id)) {
    const command = userMessage.content.split(' ')
      .filter(commandPart => !userMessage.mentions.has(getIdFromMention(commandPart)))
      .join(' ');

    logger.info('Processing command', {
      meta: {
        serverId: userMessage.guild?.id,
      },
      user: userMessage.author,
      command
    });
    commandHandler.onMessage(command, userMessage);
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

client.on("error", error => {
  logger.error(error);
});
