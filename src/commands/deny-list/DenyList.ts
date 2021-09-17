import { Message } from "discord.js";
import Command from "../../command-handler/Command";
import DenyListEmbed from "../../embeds/DenyListEmbed";
import { getDeniedRoles } from "../../services/serverManagementService";

export default class DenyList extends Command {
  readonly name = "deny list";
  readonly aliases = ["denied"];

  async onRun(userMessage: Message): Promise<boolean> {
    if (userMessage.guild) {
      const deniedRoles = await getDeniedRoles(userMessage.guild.id);

      if (deniedRoles) {
        const denyListEmbed = new DenyListEmbed(deniedRoles);

        await userMessage.channel.send({ embeds: [denyListEmbed] });
      }
      return true;
    }
    return false;
  }

  onSuccess(_userMessage: Message): void {
    return;
  }
}
