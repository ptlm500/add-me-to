import { Role as DiscordRole } from "discord.js";
import { Role } from '../entities';

export default function canAddRole(denyList: Role[], requestedRole: DiscordRole) {
  if (!denyList || denyList.length === 0) {
    return true;
  }
  return !denyList.find(role => role.discordId === requestedRole.id);
}
