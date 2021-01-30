import { Role as DiscordRole } from "discord.js";
import { Role } from '../entities';

export default function canManageRole(denyList: Role[], requestedRole: DiscordRole): boolean {
  if (!denyList || denyList.length === 0) {
    return true;
  }
  return !denyList.find(role => role.discordId === requestedRole.id);
}
