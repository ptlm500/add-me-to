import { getCustomRepository } from "typeorm";
import { Server, AdminRole, Role } from '../entities';
import ServerRepository from '../repositories/ServerRepository';
import { Collection, Role as DiscordRole } from "discord.js";

export function getAdminRoles(serverId: string): Promise<AdminRole[]|null> {
  return getServerRepository().getAdminRolesByServer(serverId);
}

export function addAdminRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server> {
  const roleIds = roles.map(getRoleId);
  return getServerRepository().addAdminRoles(serverId, roleIds);
}

export function removeAdminRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server> {
  const roleIds = roles.map(getRoleId);
  return getServerRepository().removeAdminRoles(serverId, roleIds);
}

export function updateServerName(serverId: string, newName: string): Promise<Server> {
  return getServerRepository().updateServerName(serverId, newName);
}

export async function deleteServer(serverId: string): Promise<string> {
  await getServerRepository().delete(serverId);

  return serverId;
}

export function denyRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server> {
  const roleIds = roles.map(getRoleId);
  return getServerRepository().denyRoles(serverId, roleIds);
}

export function allowRoles(serverId: string, roles: Collection<string, DiscordRole>): Promise<Server> {
  const roleIds = roles.map(getRoleId);
  return getServerRepository().allowRoles(serverId, roleIds);
}

export function getDeniedRoles(serverId: string): Promise<Role[]> {
  return getServerRepository().getDeniedRolesByServer(serverId);
}

export async function deleteRole(serverId: string, role: DiscordRole): Promise<string> {
  const roleId = getRoleId(role);
  await getServerRepository().deleteRole(serverId, roleId);

  return roleId;
}

function getRoleId(role: DiscordRole): string {
  return role.id;
}

function getServerRepository(): ServerRepository {
  return getCustomRepository(ServerRepository);
}
