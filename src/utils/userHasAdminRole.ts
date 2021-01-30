
import { GuildMember } from "discord.js";
import { AdminRole } from '../entities';

export default function userHasAdminRole(user: GuildMember, adminRoles: AdminRole[]): boolean {
  if (!adminRoles || adminRoles.length === 0) {
    return true;
  }
  return adminRoles.find(role => user.roles.cache.has(role.discordId))
    ? true : false;
}
