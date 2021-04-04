import { Message } from "discord.js";
import Command from "../command-handler/Command";
import { removeRoles } from "../controllers/roleManagementController";

export default class RemoveRoles extends Command {
  readonly name = "remove";
  readonly aliases = ["remove me from", "delete"];

  async onRun(userMessage: Message): Promise<boolean> {
    const member = userMessage?.member;
    const roles = userMessage.mentions.roles;

    if (roles.size === 0) {
      return false;
    }

    if (member) {
      return removeRoles(member, roles);
    }
    return false;
  }
}


