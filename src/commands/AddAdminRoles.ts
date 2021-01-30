import { Message } from "discord.js";
import {
  getCustomRepository
} from "typeorm";
import Command from "../command-handler/Command";
import ServerRepository from "../repositories/ServerRepository";

export default class AddAdminRoles extends Command {
  readonly name = "add admin roles";
  readonly aliases = ["add admin"];
  readonly requiresAdmin = true;

  async onRun(userMessage: Message) {
    if (userMessage && userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

        if (mentionedRoles.size === 0) {
          throw new Error("No roles mentioned");
        }

        const serverRepository = getCustomRepository(ServerRepository);
        await serverRepository.addAdminRoles(userMessage.guild.id, mentionedRoles);
        return true;
    }
    return false;
  }
}
