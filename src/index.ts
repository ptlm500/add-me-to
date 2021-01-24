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

const client = new Discord.Client();
const commandHandler = new CommandHandler(commands, addRoles);

const main = async () => {
  console.log('⌛ Initializing ORM');
  const connectionOptions = await getConnectionOptions();
  const conn = await createConnection(connectionOptions);
  console.log('✅ ORM initialised');

  console.log('⌛ Connecting Discord client');
  client.login(process.env.DISCORD_TOKEN);
};

main().catch(err => {
  console.error(err);
});

client.on(events.ready, () => {
  console.log(`🚀 Logged in as ${client.user.tag} `);
});

client.on("guildCreate", async (guild) => {
  console.log(`👋 Added to server ${guild.name}:${guild.id}`);
  await Server.create({
    discordId: guild.id,
    name: guild.name
  }).save();
  console.log(`💾 Server records created ${guild.name}:${guild.id}`);
});

// Update name on guild update

client.on(events.message, async (userMessage: Message) => {
  if (userMessage.author.bot) {
    return false;
  }
  if (userMessage.mentions.has(client.user.id)) {
    if (userMessage.author.id === process.env.ADMIN_ID) {
      const command = userMessage.content.split(' ')
        .filter(commandPart => !userMessage.mentions.has(getIdFromMention(commandPart)))
        .join(' ');

      commandHandler.onMessage(command, userMessage);
      return true;
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

client.on(events.error, (error: any) => {
  console.error(error)
});
