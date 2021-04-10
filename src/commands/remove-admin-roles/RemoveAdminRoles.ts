import { Message } from "discord.js";
import { removeAdminRoles } from "../../services/serverManagementService";
import Command from "../../command-handler/Command";
import InvalidCommandError from "../../errors/InvalidCommandError";
export default class AddAdminRoles extends Command {
  readonly name = "remove admin roles";
  readonly aliases = ["remove admin", "delete admin", "delete admin roles"];
  readonly requiresAdmin = true;

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

      if (mentionedRoles.size === 0) {
        throw new InvalidCommandError("🤷 No roles mentioned");
      }

        await removeAdminRoles(userMessage.guild.id, mentionedRoles);
        return true;
    }
    return false;
  }
}
