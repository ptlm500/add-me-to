import { GuildMember } from "discord.js";
import { getCustomRepository } from "typeorm";
import { BaseRole } from '../entities';
import ServerRepository from "../repositories/ServerRepository";

export default class User {
  private serverMembership: GuildMember;

  constructor(serverMembership: GuildMember) {
    this.serverMembership = serverMembership;
  }

  canAdministerServer(): boolean {
    return this.serverMembership.permissions.has("ADMINISTRATOR");
  }

  async canAdministerRoles(serverId: string): Promise<boolean> {
    if (this.canAdministerServer()) {
      return true;
    }

    const serverRepository = getCustomRepository(ServerRepository);
    const adminRoles = await serverRepository.getAdminRolesByServer(serverId);

    if (adminRoles) {
      return this.HasOneOfRoles(adminRoles);
    }

    return false;
  }

  HasOneOfRoles(roles: BaseRole[]): boolean {
    if (!roles || roles.length === 0) {
      return true;
    }
    return roles.find(role => this.serverMembership.roles.cache.has(role.discordId))
      ? true : false;
  }
}
