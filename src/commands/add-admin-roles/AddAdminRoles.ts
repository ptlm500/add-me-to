import { Message } from "discord.js";
import Command from "../../command-handler/Command";
import { addAdminRoles } from '../../services/serverManagementService';
import InvalidCommandError from "../../errors/InvalidCommandError";
export default class AddAdminRoles extends Command {
  readonly name = "add admin roles";
  readonly aliases = ["add admin"];
  readonly requiresAdmin = true;

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

        if (mentionedRoles.size === 0) {
          throw new InvalidCommandError("🤷 No roles mentioned");
        }

        await addAdminRoles(userMessage.guild.id, mentionedRoles);
        return true;
    }
    return false;
  }
}
