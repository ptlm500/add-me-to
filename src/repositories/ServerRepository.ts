import {
  EntityRepository,
  AbstractRepository,
  DeleteResult
} from "typeorm";
import { Collection, Role as DiscordRole } from "discord.js";
import { Server, Role, AdminRole } from '../entities';

@EntityRepository(Server)
export default class ServerRepository extends AbstractRepository<Server> {
  async denyRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server|null> {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      roles.forEach(async role => {
         await Role.create({ discordId: `${role.id}`, serverId: server.id }).save();

         return server;
      });
    }

    return null;
  }

  async allowRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server|null> {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      roles.forEach(async role => {
         await Role.delete({ discordId: `${role.id}`, serverId: server.id });
      });

      return server;
    }

    return null;
  }

  async addAdminRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server|null> {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      roles.forEach(async role => {
         await AdminRole.create({ discordId: `${role.id}`, serverId: server.id }).save();
      });

      return server;
    }

    return null;
  }

  async removeAdminRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server|null> {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      roles.forEach(async role => {
         await AdminRole.delete({ discordId: `${role.id}`, serverId: server.id });
      });

      return server;
    }

   return null;
  }

  async getDenyedRolesByServer(serverId: string): Promise<Role[]|null> {
    const server = await this.repository.findOne({ discordId: serverId }, { relations: ['denyList'] });

    if (server) {
      return server.denyList;
    }

    return null;
  }

  async getAdminRolesByServer(serverId: string): Promise<Role[]|null> {
    const server = await this.repository.findOne({ discordId: serverId }, { relations: ['adminRoles'] });

    if (server) {
      return server.adminRoles;
    }

    return null;
  }

  async delete(serverId: string): Promise<DeleteResult> {
    return await this.repository.delete({ discordId: serverId });
  }

  async deleteRole(serverId: string, role: DiscordRole): Promise<DeleteResult|null> {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      return Role.delete({ discordId: `${role.id}`, serverId: server.id });
    }

    return null;
  }

  async updateServerName(serverId: string, serverName: string): Promise<Server|null> {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      return this.repository.save({
        ...server,
        name: serverName
      });
    }
    return null;
  }
}
