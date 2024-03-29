import {
  EntityRepository,
  AbstractRepository,
  DeleteResult
} from "typeorm";
import ServerNotFoundError from "../errors/ServerMembershipNotFoundError";
import { Server, Role, AdminRole } from '../entities';

@EntityRepository(Server)
export default class ServerRepository extends AbstractRepository<Server> {
  async getServerById(serverId: string, relations?: [string]): Promise<Server> {
    const server = await this.repository.findOne(
      { where: { discordId: serverId }, relations }
    );

    if (!server) {
      throw new ServerNotFoundError();
    }

    return server;
  }

  async denyRoles(serverId: string, roleIds: string[]): Promise<Server> {
    const server = await this.getServerById(serverId);

    roleIds.forEach(async roleId => {
        await Role.create({ discordId: `${roleId}`, serverId: server.id }).save();
    });

    return server;
  }

  async allowRoles(serverId: string, roleIds: string[]): Promise<Server> {
    const server = await this.getServerById(serverId);

    roleIds.forEach(async roleId => {
        await Role.delete({ discordId: `${roleId}`, serverId: server.id });
    });

    return server;
  }

  async addAdminRoles(serverId: string, roleIds: string[]): Promise<AdminRole[]> {
    const server = await this.getServerById(serverId);

    const adminRoles: AdminRole[] = [];
    roleIds.forEach(async roleId => {
      const role = AdminRole.create({ discordId: `${roleId}`, serverId: server.id });
      await role.save();
      adminRoles.push(role);
    });

    return adminRoles;
  }

  async removeAdminRoles(serverId: string, roleIds: string[]): Promise<AdminRole[]> {
    const server = await this.getServerById(serverId);

    roleIds.forEach(async roleId => {
        await AdminRole.delete({ discordId: `${roleId}`, serverId: server.id });
    });

    return server.adminRoles;
  }

  async getDeniedRolesByServer(serverId: string): Promise<Role[]> {
    const server = await this.getServerById(serverId, ['denyList']);

    return server.denyList;
  }

  async getAdminRolesByServer(serverId: string): Promise<AdminRole[]> {
    const server = await this.getServerById(serverId, ['adminRoles']);

    return server.adminRoles;
  }

  async create(serverId: string, serverName: string): Promise<Server> {
    return Server.create({
      discordId: serverId,
      name: serverName
    }).save();
  }

  async delete(serverId: string): Promise<DeleteResult> {
    return await this.repository.delete({ discordId: serverId });
  }

  async deleteRole(serverId: string, roleId: string): Promise<DeleteResult> {
    const server = await this.getServerById(serverId);

    return Role.delete({ discordId: `${roleId}`, serverId: server.id });
  }

  async updateServerName(serverId: string, newName: string): Promise<Server> {
    const server = await this.getServerById(serverId);

    return this.repository.save({
      ...server,
      name: newName
    });
  }
}
