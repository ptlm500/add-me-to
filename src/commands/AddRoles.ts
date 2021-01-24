import { Message, GuildMember, Role as DiscordRole } from "discord.js";
import { getCustomRepository } from "typeorm";
import Command from "../command-handler/Command";
import canAddRole from "../utils/canAddRole";
import DenyedRoleError from "../errors/DenyedRoleError";
import ServerRepository from "../repositories/ServerRepository";
import DiscordApiError from "../errors/DiscordApiError";
import { Role } from "../entities";
import logger from "../logger/logger";

export default class AddRoles extends Command {
  readonly name = "add me to";

  async onRun(userMessage: Message) {
    const serverRepository = getCustomRepository(ServerRepository);
    const serverId = userMessage?.guild?.id;
    const member = userMessage?.member;
    if (serverId && member) {
      const denyList = await serverRepository.getDenyedRolesByServer(serverId);

      if (denyList) {
        return Promise.all(userMessage.mentions.roles.map(requestedRole =>
          tryAddingRole(member, requestedRole, denyList)
        ));
      }
    }
    return false;
  }
}

async function tryAddingRole(member: GuildMember, requestedRole: DiscordRole, denyList: Role[]) {
  if (canAddRole(denyList, requestedRole)) {
    return addRoleToMember(member, requestedRole).catch(e => {
      logger.warning('Couldn\'t add requested role', {
        meta: {
          serverId: member.guild.id,
        },
        requestedRole,
        user: member
      });
      throw new DiscordApiError(e);
    });
  } else {
    throw new DenyedRoleError(`Role ${requestedRole.name}:${requestedRole.id} is on the deny list`);
  }
}

function addRoleToMember(member: GuildMember, role: DiscordRole) {
  logger.info(`✏ Adding role ${role.name} to ${member.displayName}`, {
    meta: {
      serverId: member.guild.id,
    },
    role,
    user: member
  });
  return member.roles.add(role);
}
