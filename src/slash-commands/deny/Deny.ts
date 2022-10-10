import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";
import { denyRoles } from "../../services/serverManagementService";
import SlashCommand, { InteractionResponse } from "../../command-handler/SlashCommand";
import { Interaction, getRoleOption } from "../../command-handler/interaction/interaction";

const ROLE_OPTION = 'role';
export default class Deny extends SlashCommand {
  ephemeral = true;
  requiresAdmin = true;
  readonly slashCommandBuilder = new SlashCommandBuilder()
    .setName('deny')
    .setDescription('Prevent users from adding themselves to a role')
    .addRoleOption(option =>
      option.setName(ROLE_OPTION)
        .setDescription('The role to prevent users from adding to themselves')
        .setRequired(true));

  async onInteract(interaction: Interaction): Promise<InteractionResponse> {
    const role = await getRoleOption(interaction);

    await denyRoles(interaction.guildId, new Collection([[role.name, role]]));

    return { content: `✅ users can now add themselves to <@&${role.id}> using the bot` };
  }
}
