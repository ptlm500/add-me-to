import { Message } from "discord.js";
import Command from "../command-handler/Command";
import { removeRoles } from "../controllers/roleManagementController";
import InvalidCommandError from "../errors/InvalidCommandError";

export default class RemoveRoles extends Command {
  readonly name = "remove";
  readonly aliases = ["remove me from", "delete"];

  async onRun(userMessage: Message): Promise<boolean> {
    const member = userMessage?.member;
    const mentionedRoles = userMessage.mentions.roles;

    if (mentionedRoles.size === 0) {
      throw new InvalidCommandError("🤷 No roles mentioned");
    }

    if (member) {
      return removeRoles(member, mentionedRoles);
    }
    return false;
  }
}
