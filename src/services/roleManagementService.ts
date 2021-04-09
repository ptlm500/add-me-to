import { GuildMember, Role as DiscordRole } from "discord.js";
import logger from "../logger/logger";

export function addRoleToMember(member: GuildMember, role: DiscordRole): Promise<GuildMember> {
  logger.info(`✏ Adding role ${role.name} to ${member.displayName}`, {
    meta: {
      serverId: member.guild.id,
    },
    role,
    user: member
  });
  return member.roles.add(role);
}

export function removeRoleFromMember(member: GuildMember, role: DiscordRole): Promise<GuildMember> {
  logger.info(`🗑 Removing ${role.name} from ${member.displayName}`, {
    meta: {
      serverId: member.guild.id,
    },
    role,
    user: member
  });
  return member.roles.remove(role);
}
