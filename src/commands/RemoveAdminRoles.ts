import { Message } from "discord.js";
import {
  getCustomRepository
} from "typeorm";
import Command from "../command-handler/Command";
import ServerRepository from "../repositories/ServerRepository";

export default class AddAdminRoles extends Command {
  readonly name = "remove admin roles";
  readonly aliases = ["remove admin", "delete admin", "delete admin roles"];
  readonly requiresAdmin = true;

  async onRun(userMessage: Message) {
    if (userMessage && userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

        if (mentionedRoles.size === 0) {
          throw new Error("No roles mentioned");
        }

        const serverRepository = getCustomRepository(ServerRepository);
        await serverRepository.removeAdminRoles(userMessage.guild.id, mentionedRoles);
        return true;
    }
    return false;
  }
}
