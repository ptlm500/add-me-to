import { Message } from "discord.js";
import {
  getCustomRepository
} from "typeorm";
import Command from "../command-handler/Command";
import ServerRepository from "../repositories/ServerRepository";
import DenyListEmbed from "../embeds/DenyListEmbed";

export default class DenyList extends Command {
  readonly name = "deny list";

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage && userMessage.guild) {
      const serverRepository = getCustomRepository(ServerRepository);
      const denyedRoles = await serverRepository.getDenyedRolesByServer(userMessage.guild.id);

      if (denyedRoles) {
        const denyListEmbed = new DenyListEmbed(denyedRoles);

        await userMessage.channel.send(denyListEmbed);
      }
      return true;
    }
    return false;
  }

  onSuccess(_userMessage: Message): void {
    return;
  }
}
