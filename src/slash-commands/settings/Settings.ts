import { SlashCommandBuilder } from "@discordjs/builders";
import { getAdminRoles, getDeniedRoles } from "../../services/serverManagementService";
import generateSettingsEmbed from "../../embeds/generateSettingsEmbed";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import { Interaction } from "../../command-handler/interaction/interaction";

export default class Settings extends SlashCommand {
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage settings');

  async onInteract(interaction: Interaction): Promise<InteractionResponse> {
    const adminRoles = await getAdminRoles(interaction.guildId);
    const deniedRoles = await getDeniedRoles(interaction.guildId);

    return { embeds: [generateSettingsEmbed(adminRoles, deniedRoles)] };
  }
}
