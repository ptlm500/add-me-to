import { Message } from "discord.js";
import Command from "../command-handler/Command";
import { getAdminRoles } from "../services/serverManagementService";
import SettingsEmbed from "../embeds/SettingsEmbed";

export default class SettingsList extends Command {
  readonly name = "settings list";

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage.guild) {
      const adminRoles = await getAdminRoles(userMessage.guild.id);

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
