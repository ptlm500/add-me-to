import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getAdminRoles, getDeniedRoles } from "../../services/serverManagementService";
import generateSettingsEmbed from "../../embeds/SettingsEmbed";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";

export default class Settings extends SlashCommand {
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage settings');

  async onInteract(interaction: CommandInteraction): Promise<InteractionResponse> {
    const adminRoles = await getAdminRoles(interaction.guildId!);
    const deniedRoles = await getDeniedRoles(interaction.guildId!);

    return { embeds: [generateSettingsEmbed(adminRoles, deniedRoles)] };
  }
}
