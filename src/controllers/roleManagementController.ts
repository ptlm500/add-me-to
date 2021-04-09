import { GuildMember, Role as DiscordRole, Collection } from "discord.js";
import { Role } from '../entities';
import { getDeniedRoles } from "../services/serverManagementService";
import { addRoleToMember, removeRoleFromMember } from "../services/roleManagementService";
import DeniedRoleError from "../errors/DeniedRoleError";
import DiscordApiError from "../errors/DiscordApiError";

export async function addRoles(
  member: GuildMember,
  roles: Collection<string, DiscordRole>
): Promise<boolean> {
  return manageRoles(member, roles, addRoleToMember);
}

export async function removeRoles(
  member: GuildMember,
  roles: Collection<string, DiscordRole>
): Promise<boolean> {
  return manageRoles(member, roles, removeRoleFromMember);
}

async function manageRoles(
  member: GuildMember,
  roles: Collection<string, DiscordRole>,
  action: (member: GuildMember, role: DiscordRole) => Promise<GuildMember>
): Promise<boolean> {
  const denyList = await getDeniedRoles(member.guild.id);

  await Promise.all(roles.map(role => {
    if (!canManageRole(denyList, role)) {
      throw new DeniedRoleError(`🔒 Role ${role.name}:${role.id} is on the deny list`);
    }
    return action(member, role).catch(e => {
      throw new DiscordApiError(e);
    })
  }));

  return true;
}

function canManageRole(denyList: Role[], requestedRole: DiscordRole): boolean {
  if (!denyList || denyList.length === 0) {
    return false;
  }

  return !denyList.find(role => role.discordId === requestedRole.id);
}
