import { Message } from "discord.js";
import { denyRoles } from "../../services/serverManagementService";
import Command from "../../command-handler/Command";
import InvalidCommandError from "../../errors/InvalidCommandError";

export default class Deny extends Command {
  readonly name = "deny";
  readonly requiresAdmin = true;

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

        if (mentionedRoles.size === 0) {
          throw new InvalidCommandError("🤷 No roles mentioned");
        }

        denyRoles(userMessage.guild.id, mentionedRoles);
        return true;
    }
    return false;
  }
}
