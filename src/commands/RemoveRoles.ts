import { Message, GuildMember, Role as DiscordRole } from "discord.js";
import { getCustomRepository } from "typeorm";
import Command from "../command-handler/Command";
import canManageRole from "../utils/canManageRole";
import DenyedRoleError from "../errors/DenyedRoleError";
import ServerRepository from "../repositories/ServerRepository";
import DiscordApiError from "../errors/DiscordApiError";
import { Role } from "../entities";
import logger from "../logger/logger";

export default class RemoveRoles extends Command {
  readonly name = "remove";
  readonly aliases = ["remove me from", "delete"];

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
  if (canManageRole(denyList, requestedRole)) {
    return removeRoleFromMember(member, requestedRole).catch(e => {
      logger.warning('⚠ Couldn\'t remove requested role', {
        meta: {
          serverId: member.guild.id,
        },
        requestedRole,
        user: member
      });
      throw new DiscordApiError(e);
    });
  } else {
    throw new DenyedRoleError(`🔒 Role ${requestedRole.name}:${requestedRole.id} is on the deny list`);
  }
}


function removeRoleFromMember(member: GuildMember, role: DiscordRole) {
  logger.info(`🗑 Removing ${role.name} from ${member.displayName}`, {
    meta: {
      serverId: member.guild.id,
    },
    role,
    user: member
  });
  return member.roles.remove(role);
}

