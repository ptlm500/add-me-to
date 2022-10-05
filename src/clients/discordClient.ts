import Discord, { Guild, GatewayIntentBits, Role } from "discord.js";
import logger from '../logger/logger';
import { createServer, deleteServer, updateServerName, deleteRole } from "../services/serverManagementService";
import slashCommands from "../slash-commands";
import SlashCommandHandler from "../command-handler/SlashCommandHandler";

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

client.on('interactionCreate', interaction => {
  if (interaction.isChatInputCommand()) {
    slashCommandHandler.onInteract(interaction);
  }
});

client.on("error", error => {
  logger.error(error);
});

export default client;
