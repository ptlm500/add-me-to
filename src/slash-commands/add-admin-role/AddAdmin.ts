import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";
import { addAdminRoles } from "../../services/serverManagementService";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import { Interaction, getRoleOption } from "../../command-handler/interaction/interaction";

const ROLE_OPTION = 'role';
export default class AddAdmin extends SlashCommand {
  ephemeral = true;
  requiresAdmin = true;
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('addadmin')
    .setDescription('Add admin role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to be add as an admin role')
        .setRequired(true));

  async onInteract(interaction: Interaction): Promise<InteractionResponse> {
    const role = await getRoleOption(interaction);

    await addAdminRoles(interaction.guildId, new Collection([[role.name, role]]));
    return { content: `✅ any user with <@&${role.id}> is now an admin of the bot` };
  }
}
