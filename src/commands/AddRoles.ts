import { Message } from "discord.js";
import Command from "../command-handler/Command";
import { addRoles } from "../controllers/roleManagementController";
import InvalidCommandError from "../errors/InvalidCommandError";

export default class AddRoles extends Command {
  readonly name = "add me to";
  readonly aliases = ["to", "add"];

  async onRun(userMessage: Message): Promise<boolean> {
    const member = userMessage?.member;
    const mentionedRoles = userMessage.mentions.roles;

    if (mentionedRoles.size === 0) {
      throw new InvalidCommandError("🤷 No roles mentioned");
    }

    if (member) {
      return addRoles(member, mentionedRoles);
    }
    return false;
  }
}

