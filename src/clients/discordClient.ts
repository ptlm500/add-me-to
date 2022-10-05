import Discord, { Guild, GatewayIntentBits, Message, Role } from "discord.js";
import logger from '../logger/logger';
import { createServer, deleteServer, updateServerName, deleteRole } from "../services/serverManagementService";
import CommandHandler from "../command-handler/CommandHandler";
import commands, { addRoles } from '../commands';
import slashCommands from "../slash-commands";
import SlashCommandHandler from "../command-handler/SlashCommandHandler";

const commandHandler = new CommandHandler(commands, addRoles);
const slashCommandHandler = new SlashCommandHandler(slashCommands);

const client = new Discord.Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });

client.on("ready", async () => {
  if (client.user) {
    logger.notice(`🚀 Logged in as ${client.user.tag}`);
  } else {
    logger.warning('🚀 Logged in as unknown user', { client });
  }

  await slashCommandHandler.registerCommands();
  logger.notice(`🌍 Online and serving ${client.guilds.cache.size} servers`);
  client.user?.setActivity('@add me to @role');
});

client.on("guildCreate", async (guild) => {
  logger.notice(`👋 Added to server ${guild.name}:${guild.id}`, {
    meta: {
      serverId: guild.id,
    }
  });
  const newServer = await createServer(guild);

  logger.notice(`💾 Server records created ${newServer.name}:${newServer.discordId}`, {
    meta: {
      serverId: guild.id,
    }
  });
});

client.on("guildDelete", async (guild) => {
  logger.notice(`😥 Removed from server ${guild.name}:${guild.id}`, {
    meta: {
      serverId: guild.id,
    }
  });
  deleteServer(guild.id).then(() => {
    logger.notice(`🗑 Server records removed ${guild.name}:${guild.id}`, {
      meta: {
        serverId: guild.id,
      }
    });
  });
});

client.on("guildUpdate", async (oldGuild: Guild, newGuild: Guild) => {
  if (oldGuild.name !== newGuild.name) {
    logger.info('📝 Guild name updated', {
      meta: {
        serverId: newGuild.id,
      },
    });

    const updatedServer = await updateServerName(newGuild.id, newGuild.name);
    logger.notice('💾 Guild name update written', {
      meta: {
        serverId: newGuild.id,
        oldName: oldGuild.name,
        newName: updatedServer.name
      }
    });
  }
});

client.on("roleDelete", async (deletedRole: Role) => {
  const guild = deletedRole.guild;
  await deleteRole(guild.id, deletedRole);
  logger.notice(`🗑 Deleted role ${deletedRole.name}:${deletedRole.id}`, {
    meta: {
      serverId: guild.id
    },
    deletedRole
  });
});

client.on("message", async (userMessage: Message) => {
  if (userMessage.author.bot) {
    return;
  }
  if (client.user && userMessage.mentions.has(client.user.id) && !userMessage.mentions.everyone) {
    const command = commandParser(userMessage);

    logger.info('⏳ Processing command', {
      meta: {
        serverId: userMessage.guild?.id,
      },
      user: userMessage.author,
      command
    });
    commandHandler.onMessage(command, userMessage);
  }
});

client.on('interactionCreate', interaction => {
  if (interaction.isChatInputCommand()) {
    slashCommandHandler.onInteract(interaction);
  }
});

function commandParser(userMessage: Message): string {
  return userMessage.content.split(' ')
  .filter(commandPart => !userMessage.mentions.has(getIdFromMention(commandPart)))
  .join(' ');
}

function getIdFromMention(mention: string): string {
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

export default client;
