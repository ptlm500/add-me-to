import { GuildMember, PermissionString, Role as DiscordRole } from "discord.js";
import { AdminRole } from '../entities';
import { getAdminRoles} from "../services/serverManagementService";

export default class User {
  readonly permissions: PermissionString[];
  readonly roles: DiscordRole[];
  constructor(permissions: PermissionString[], roles: DiscordRole[]) {
    this.permissions = permissions;
    this.roles = roles;
  }

  static fromGuildMember(guildMember: GuildMember): User {
    return new User(guildMember.permissions.toArray(), guildMember.roles.cache.array())
  }

  canAdministerServer(): boolean {
    return this.permissions.includes("ADMINISTRATOR");
  }

  async canAdministerRoles(serverId: string): Promise<boolean> {
    if (this.canAdministerServer()) {
      return true;
    }

    const adminRoles = await getAdminRoles(serverId);
    if (adminRoles) {
      return this.hasOneOfRoles(adminRoles);
    }

    return false;
  }

  hasOneOfRoles(roles: AdminRole[]): boolean {
    if (!roles || roles.length === 0) {
      return true;
    }
    return roles.find(role =>
      this.roles.find(r => findRoleById(r, role.discordId))
    ) ? true : false;
  }
}

function findRoleById(role: DiscordRole, roleId: string) {
  return role.id === roleId;
}
