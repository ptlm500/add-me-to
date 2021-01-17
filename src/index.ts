import { GuildMember, Message, Role } from "discord.js";

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const {
  denyList,
  events,
  reacts
} = require('./config.json');

client.login(process.env.DISCORD_TOKEN);

client.on(events.ready, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(events.message, async msg => {
  if (msg.author.bot) {
    return false;
  }
  if (msg.mentions.has(client.user.id)) {
    msg.mentions.roles.forEach((role: Role) => {
      if (canManageRole(msg.guild.id, role)) {
          if (memberHasRole(msg.member, role)) {
            msg.react(reacts.userHasRole);
          } else {
            addRole(msg, role).catch(e => {
              console.log(e);
              msg.react(reacts.error);
            });
          }
      } else {
        msg.react(reacts.notAllowed);
      }
    });
  }
});

client.on(events.error, (error: any) => {
  console.error(error)
});

async function addRole(msg: Message, role: Role) {
  const member = msg.member;
  if (member) {
    console.log(`Adding role ${role} to ${member.displayName}`);
    await member.roles.add(role);
    msg.react(reacts.done);
  }
}

function canManageRole(guildId: string, role: { id: string; }) {
  if (denyList[guildId]) {
    return !denyList[guildId].includes(role.id);
  }
  return true;
}

function memberHasRole(member: GuildMember, role: Role) {
  return member.roles.cache.find(r => r.id === role.id)
}
