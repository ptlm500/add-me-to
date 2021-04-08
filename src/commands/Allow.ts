import { Message } from "discord.js";
import { allowRoles } from "../services/serverManagementService";
import Command from "../command-handler/Command";
import InvalidCommandError from '../errors/InvalidCommandError';

export default class Allow extends Command {
  readonly name = "allow";
  readonly requiresAdmin = true;

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

      if (mentionedRoles.size === 0) {
        throw new InvalidCommandError("🤷 No roles mentioned");
      }

      await allowRoles(userMessage.guild.id, mentionedRoles);
      return true;
    }
    return false;
  }
}
