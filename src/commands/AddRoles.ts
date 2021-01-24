import { Message, GuildMember, Role as DiscordRole } from "discord.js";
import { getCustomRepository } from "typeorm";
import Command from "../command-handler/Command";
import canAddRole from "../utils/canAddRole";
import UserPermissionsError from "../errors/UserPermissionsError";
import ServerRepository from "../repositories/ServerRepository";
import DiscordApiError from "../errors/DiscordApiError";
import { Role } from "../entities";

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
      console.error(`Couldn't add ${requestedRole.name}:${requestedRole.id} to ${member.displayName}:${member.id}`);
      throw new DiscordApiError(e);
    });
  } else {
    console.log(`Couldn't add ${requestedRole.name}:${requestedRole.id} to ${member.displayName}:${member.id}`);
    throw new UserPermissionsError(`${member.displayName}:${member.id} doesn't have permissions to add roles.`);
  }
}

function addRoleToMember(member: GuildMember, role: DiscordRole) {
  console.log(`✏ Adding role ${role.name}:${role.id} to ${member.displayName}`);
  return member.roles.add(role);
}
