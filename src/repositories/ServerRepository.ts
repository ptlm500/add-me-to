import {
  EntityRepository,
  AbstractRepository
} from "typeorm";
import { Collection, Role as DiscordRole } from "discord.js";
import { Server, Role } from '../entities';

@EntityRepository(Server)
export default class ServerRepository extends AbstractRepository<Server> {
  async denyRoles(serverId: string, roles: Collection<string, DiscordRole>) {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      roles.forEach(async role => {
         await Role.create({ discordId: `${role.id}`, serverId: server.id }).save();
      });
    }

    return null;
  }

  async allowRoles(serverId: string, roles: Collection<string, DiscordRole>) {
    const server = await this.repository.findOne({ discordId: serverId });

    if (server) {
      roles.forEach(async role => {
         await Role.delete({ discordId: `${role.id}`, serverId: server.id });
      });
    }

    return null;
  }

  async getDenyedRolesByServer(serverId: string) {
    const server = await this.repository.findOne({ discordId: serverId }, { relations: ['denyList'] });

    if (server) {
      return server.denyList;
    }

    return null;
  }
}
