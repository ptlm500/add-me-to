import { Message } from "discord.js";
import {
  getCustomRepository
} from "typeorm";
import Command from "../command-handler/Command";
import ServerRepository from "../repositories/ServerRepository";

export default class Allow extends Command {
  readonly name = "allow";
  readonly requiresAdmin = true;

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage && userMessage.guild) {
      const mentionedRoles = userMessage.mentions.roles;

      if (mentionedRoles.size === 0) {
        throw new Error("No roles mentioned");
      }

      const serverRepository = getCustomRepository(ServerRepository);
      await serverRepository.allowRoles(userMessage.guild.id, mentionedRoles);
      return true;
    }
    return false;
  }
}
