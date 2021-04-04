import { Message } from "discord.js";
import Command from "../command-handler/Command";
import { addRoles } from "../controllers/roleManagementController";

export default class AddRoles extends Command {
  readonly name = "add me to";
  readonly aliases = ["to", "add"];

  async onRun(userMessage: Message): Promise<boolean> {
    const member = userMessage?.member;
    const roles = userMessage.mentions.roles;

    if (roles.size === 0) {
      return false;
    }

    if (member) {
      return addRoles(member, roles);
    }
    return false;
  }
}

