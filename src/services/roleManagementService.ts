import { GuildMember, Role as DiscordRole } from "discord.js";
import logger from "../logger/logger";
import DiscordApiError from "../errors/DiscordApiError";

export function addRoleToMember(member: GuildMember, role: DiscordRole): Promise<GuildMember> {
  logger.info(`✏ Adding role ${role.name} to ${member.displayName}`, {
    meta: {
      serverId: member.guild.id,
    },
    role,
    user: member
  });
  return member.roles.add(role).catch(e => {
    logger.error('⚠ Couldn\'t add requested role', {
      meta: {
        serverId: member.guild.id,
      },
      role,
      user: member
    });
    throw new DiscordApiError(e);
  });
}

export function removeRoleFromMember(member: GuildMember, role: DiscordRole): Promise<GuildMember> {
  logger.info(`🗑 Removing ${role.name} from ${member.displayName}`, {
    meta: {
      serverId: member.guild.id,
    },
    role,
    user: member
  });
  return member.roles.remove(role).catch(e => {
    logger.error('⚠ Couldn\'t remove requested role', {
      meta: {
        serverId: member.guild.id,
      },
      role,
      user: member
    });
    throw new DiscordApiError(e);
  });
}
