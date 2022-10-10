import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";
import { removeAdminRoles } from "../../services/serverManagementService";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import { Interaction, getRoleOption } from "../../command-handler/interaction/interaction";

const ROLE_OPTION = 'role';
export default class RemoveAdminRole extends SlashCommand {
  ephemeral = true;
  requiresAdmin = true;
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('removeadmin')
    .setDescription('Remove admin role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to be removed as an admin role')
        .setRequired(true));

  async onInteract(interaction: Interaction): Promise<InteractionResponse> {
    const role = await getRoleOption(interaction);

    await removeAdminRoles(interaction.guildId, new Collection([[role.name, role]]));

    return { content: `✅ users with <@&${role.id}> are no longer admins of the bot` };
  }
}
