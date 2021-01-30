import { Message } from "discord.js";
import {
  getCustomRepository
} from "typeorm";
import Command from "../command-handler/Command";
import ServerRepository from "../repositories/ServerRepository";
import SettingsEmbed from "../embeds/SettingsEmbed";

export default class SettingsList extends Command {
  readonly name = "settings list";

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage && userMessage.guild) {
      const serverRepository = getCustomRepository(ServerRepository);
      const adminRoles = await serverRepository.getAdminRolesByServer(userMessage.guild.id);

      if (adminRoles) {
        const settingsEmbed = new SettingsEmbed(adminRoles);

        await userMessage.channel.send(settingsEmbed);
      }
      return true;
    }
    return false;
  }

  onSuccess(_userMessage: Message): void {
    return;
  }
}
